import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Smartphone, 
  Mail, 
  Sparkles,
  Shield,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type LoginStep = "method" | "phone" | "email" | "otp";

const LoginPage = () => {
  const { user, signInWithOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>("method");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const handleSendOTP = async () => {
    setIsLoading(true);
    const identifier = phoneNumber || email;
    const isPhone = step === "phone";

    const { error } = await signInWithOTP(identifier, isPhone);

    setIsLoading(false);
    if (error) {
      console.error("Failed to send OTP:", error);
      return;
    }

    if (isPhone) {
      setStep("otp");
      setResendTimer(30);
      // Start countdown
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Email flow uses magic link from Supabase; no OTP step here
      // We leave the user on the email entry screen; the AuthContext already showed a toast
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    const identifier = phoneNumber || email;
    const isPhone = !!phoneNumber;
    
    const { error } = await verifyOTP(identifier, otp, isPhone);
    
    setIsLoading(false);
    
    if (error) {
      console.error("OTP verification failed:", error);
      // The verifyOTP function already shows a toast, so we don't need to show another one
    }
    // If successful, verifyOTP will handle the redirect to /onboarding
  };

  const slideVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <motion.div
              className="flex items-center space-x-2 justify-center group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CLOZET
              </span>
            </motion.div>
          </Link>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Quick OTP and you're in
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <Card className="glass-strong p-8 border-0">
          <AnimatePresence mode="wait">
            {/* Method Selection */}
            {step === "method" && (
              <motion.div
                key="method"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-center mb-6">
                  Choose login method
                </h2>
                
                <Button
                  variant="glass"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => setStep("phone")}
                >
                  <Smartphone className="w-5 h-5" />
                  Continue with Phone
                </Button>
                
                <Button
                  variant="glass"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => setStep("email")}
                >
                  <Mail className="w-5 h-5" />
                  Continue with Email
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  variant="outline-neon"
                  size="lg"
                  className="w-full"
                  onClick={() => console.log("Google login")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>
            )}

            {/* Phone Input */}
            {step === "phone" && (
              <motion.div
                key="phone"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep("method")}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">Enter your phone</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Mobile Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 XXXXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="glass"
                    />
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleSendOTP}
                    disabled={!phoneNumber || isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setStep("email")}
                    className="text-sm text-primary hover:underline"
                  >
                    Use Email instead
                  </button>
                </div>
              </motion.div>
            )}

            {/* Email Input */}
            {step === "email" && (
              <motion.div
                key="email"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep("method")}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">Enter your email</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass"
                    />
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleSendOTP}
                    disabled={!email || isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setStep("phone")}
                    className="text-sm text-primary hover:underline"
                  >
                    Use Phone instead
                  </button>
                </div>
              </motion.div>
            )}

            {/* OTP Verification */}
            {step === "otp" && (
              <motion.div
                key="otp"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep(phoneNumber ? "phone" : "email")}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">Verify OTP</h2>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    We sent 6-digit code to{" "}
                    <span className="font-medium text-foreground">
                      {phoneNumber || email}
                    </span>
                  </p>
                  {(email?.toLowerCase() === 'demo@clozet.com' || email?.startsWith('demo')) && (
                    <div className="glass-strong border border-primary/20 rounded-lg p-3 mt-3">
                      <p className="text-xs text-primary font-semibold">
                        🎮 Demo Mode: Enter any 6-digit code (e.g., 123456)
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Enter OTP
                    </label>
                    <Input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="glass text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6 || isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                </div>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleSendOTP}
                      className="text-sm text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Trust Indicators */}
        <motion.div
          className="mt-8 flex items-center justify-center space-x-6 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-primary" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-secondary" />
            <span>Quick & Easy</span>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;