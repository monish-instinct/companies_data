import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, FileText, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const TermsAndPolicies = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <motion.header 
        className="glass-strong border-b border-border/20 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
          <Link to="/dashboard">
            <Button variant="glass" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Terms & Policies</h1>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="return">Return Policy</TabsTrigger>
            </TabsList>

            {/* Terms of Service */}
            <TabsContent value="terms">
              <Card className="glass-strong p-6 border-0">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Terms of Service</h2>
                    <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
                  </div>
                </div>

                <div className="space-y-6 text-muted-foreground">
                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h3>
                    <p>By accessing and using CLOZET, you accept and agree to be bound by the terms and provision of this agreement.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">2. Use License</h3>
                    <p>Permission is granted to temporarily download one copy of the materials on CLOZET's app for personal, non-commercial transitory viewing only.</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose</li>
                      <li>Attempt to reverse engineer any software</li>
                      <li>Remove any copyright or proprietary notations</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">3. Product Information</h3>
                    <p>We strive to display product information accurately. However, we do not warrant that product descriptions, colors, or other content is accurate, complete, reliable, or error-free.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">4. Pricing</h3>
                    <p>All prices are in Indian Rupees (₹) and are inclusive of taxes unless otherwise stated. We reserve the right to change prices at any time.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">5. Account Terms</h3>
                    <p>You are responsible for maintaining the security of your account and password. CLOZET cannot be held liable for any loss or damage from your failure to comply with this security obligation.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">6. Limitation of Liability</h3>
                    <p>CLOZET shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use or inability to use the service.</p>
                  </section>
                </div>
              </Card>
            </TabsContent>

            {/* Privacy Policy */}
            <TabsContent value="privacy">
              <Card className="glass-strong p-6 border-0">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Privacy Policy</h2>
                    <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
                  </div>
                </div>

                <div className="space-y-6 text-muted-foreground">
                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, including:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Name, email address, and phone number</li>
                      <li>Delivery addresses and payment information</li>
                      <li>Order history and preferences</li>
                      <li>Location data (with your permission)</li>
                      <li>Device information and usage data</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h3>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Process and deliver your orders</li>
                      <li>Provide customer support</li>
                      <li>Send you updates about your orders</li>
                      <li>Personalize your shopping experience</li>
                      <li>Improve our services</li>
                      <li>Detect and prevent fraud</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">3. Information Sharing</h3>
                    <p>We may share your information with:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Partner stores to fulfill your orders</li>
                      <li>Payment processors for transaction processing</li>
                      <li>Delivery partners for order fulfillment</li>
                      <li>Service providers who assist our operations</li>
                    </ul>
                    <p className="mt-2">We do not sell your personal information to third parties.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">4. Data Security</h3>
                    <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">5. Your Rights</h3>
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Withdraw consent for data processing</li>
                    </ul>
                  </section>
                </div>
              </Card>
            </TabsContent>

            {/* Return Policy */}
            <TabsContent value="return">
              <Card className="glass-strong p-6 border-0">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Return & Refund Policy</h2>
                    <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
                  </div>
                </div>

                <div className="space-y-6 text-muted-foreground">
                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">1. Return Window</h3>
                    <p>You can return most items within 7 days of delivery for a full refund or exchange, provided they meet our return conditions.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">2. Return Conditions</h3>
                    <p>To be eligible for a return, items must:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Be unused and in original condition</li>
                      <li>Have all original tags attached</li>
                      <li>Be in original packaging</li>
                      <li>Include original invoice</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">3. Non-Returnable Items</h3>
                    <p>The following items cannot be returned:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Innerwear and swimwear</li>
                      <li>Customized or personalized items</li>
                      <li>Items marked as "Final Sale"</li>
                      <li>Gift cards</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">4. Return Process</h3>
                    <ol className="list-decimal list-inside mt-2 space-y-2 ml-4">
                      <li>Initiate return from your Orders page</li>
                      <li>Select reason for return</li>
                      <li>Schedule pickup (free of charge)</li>
                      <li>Hand over the package to our delivery partner</li>
                      <li>Refund processed within 5-7 business days</li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">5. Refund Method</h3>
                    <p>Refunds will be issued to your original payment method:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Credit/Debit Card: 5-7 business days</li>
                      <li>UPI/Wallet: 2-3 business days</li>
                      <li>Net Banking: 5-7 business days</li>
                      <li>Cash on Delivery: Bank transfer within 7 days</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">6. Exchanges</h3>
                    <p>For size or color exchanges, we offer free exchange within 7 days. The replacement will be shipped once we receive and verify the returned item.</p>
                  </section>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndPolicies;
