import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Get request body
    const { orderTotal, deliveryCharge, orderItems, deliveryAddress, email: bodyEmail } = await req.json();

    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : undefined;
    const { data } = token ? await supabaseClient.auth.getUser(token) : { data: { user: null } } as any;
    const user = data?.user || null;

    const customerEmail = (user?.email as string | undefined) || (bodyEmail as string | undefined) || "guest@clozet.demo";
    const userIdForMeta = (user?.id as string | undefined) || "guest";

    console.log("Creating payment for:", customerEmail);

    // Initialize Stripe
    const secret = Deno.env.get("STRIPE_SECRET_KEY") || "";
    if (!secret) {
      return new Response(
        JSON.stringify({ error: "Stripe secret is not configured (STRIPE_SECRET_KEY)." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
      );
    }

    const stripe = new Stripe(secret, {
      apiVersion: "2024-06-20",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          supabase_user_id: userIdForMeta,
        },
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    // Create checkout session with line items
    const lineItems = orderItems.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: item.description || undefined,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: item.quantity,
    }));

    // Add delivery charge as a line item
    if (deliveryCharge > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charge",
            description: "Express delivery service",
          },
          unit_amount: Math.round(deliveryCharge * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") || Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/order/{CHECKOUT_SESSION_ID}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        user_id: userIdForMeta,
        delivery_address: JSON.stringify(deliveryAddress || {}),
        delivery_type: "express",
        // Optional: provide store_id to allow order creation in complete-payment
        // store_id: "<STORE_ID>",
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Payment creation failed" 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
