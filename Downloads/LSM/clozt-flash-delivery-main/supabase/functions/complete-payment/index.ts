import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing sessionId");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ paid: false, sessionId, reason: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    const metadata = session.metadata || {};
    const userId = metadata.user_id;
    const deliveryAddress = metadata.delivery_address ? JSON.parse(metadata.delivery_address) : null;
    const storeId = metadata.store_id || null; // provide this from client if you want orders inserted

    // Compose basic order data
    const subtotal = ((session.amount_subtotal || 0) / 100);
    const total = ((session.amount_total || 0) / 100);
    const deliveryCharge = Math.max(0, total - subtotal);

    let inserted: any = null;

    if (userId && storeId && deliveryAddress) {
      // Try inserting order only if we have required fields for FK
      const orderNumber = `CLZ${Date.now().toString().slice(-8)}`;
      const { data, error } = await supabase
        .from('orders')
        .insert({
          id: sessionId,
          order_number: orderNumber,
          user_id: userId,
          store_id: storeId,
          items: session.line_items ? session.line_items.data.map((li: any) => ({
            description: li.description,
            quantity: li.quantity,
            amount_subtotal: li.amount_subtotal,
            amount_total: li.amount_total,
          })) : [],
          subtotal,
          tax: 0,
          delivery_charge: deliveryCharge,
          total,
          delivery_type: metadata.delivery_type || 'standard',
          delivery_address: deliveryAddress,
          payment_status: 'paid',
          order_status: 'confirmed',
        })
        .select()
        .single();

      if (error) {
        console.error('Order insert failed:', error);
      } else {
        inserted = data;
      }
    }

    return new Response(
      JSON.stringify({
        paid: true,
        sessionId,
        orderNumber: inserted?.order_number || sessionId,
        orderId: inserted?.id || sessionId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    console.error("Complete payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
