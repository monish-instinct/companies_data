import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Send, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thank You!",
      description: "Your feedback has been submitted successfully",
    });

    // Reset form
    setRating(0);
    setFeedback("");
    setEmail("");
  };

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
          <h1 className="text-xl font-bold">Feedback</h1>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className="glass-strong p-8 border-0">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">We Value Your Feedback</h2>
              <p className="text-muted-foreground">
                Help us improve by sharing your thoughts and suggestions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <Label className="text-base font-semibold mb-3 block">How would you rate your experience?</Label>
                <div className="flex justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || rating)
                            ? 'text-accent fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {rating === 0 && "Select a rating"}
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-base font-semibold">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 glass border-0 bg-white/5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll only use this to follow up on your feedback
                </p>
              </div>

              {/* Feedback */}
              <div>
                <Label htmlFor="feedback" className="text-base font-semibold">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us what you think about CLOZET. What do you like? What can we improve?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2 min-h-[150px] glass border-0 bg-white/5 resize-none"
                  required
                />
              </div>

              {/* Quick Feedback Options */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Quick Feedback (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Easy to use",
                    "Great products",
                    "Fast delivery",
                    "Good prices",
                    "Excellent support",
                    "Love the AI try-on"
                  ].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant="glass"
                      size="sm"
                      onClick={() => {
                        if (feedback.includes(option)) {
                          setFeedback(feedback.replace(option + ", ", "").replace(option, ""));
                        } else {
                          setFeedback(feedback ? `${feedback}, ${option}` : option);
                        }
                      }}
                      className={feedback.includes(option) ? "ring-2 ring-primary" : ""}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 glass rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                Your feedback helps us create a better shopping experience for everyone. Thank you for taking the time to share your thoughts!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
