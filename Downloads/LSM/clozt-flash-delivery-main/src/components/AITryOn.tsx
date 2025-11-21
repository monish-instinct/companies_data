import { motion } from "framer-motion";
import { Upload, Sparkles, Loader2, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AITryOn = () => {
  const { toast } = useToast();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [tryonResult, setTryonResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const products = [
    {
      id: "1",
      name: "Premium Cotton T-Shirt",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: "2",
      name: "Designer Jeans",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: "3",
      name: "Floral Summer Dress",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop"
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async () => {
    if (!userImage || !selectedProduct) {
      toast({
        title: "Missing Information",
        description: "Please upload your photo and select a product.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const productImage = products.find(p => p.id === selectedProduct)?.image;
      
      const { data, error } = await supabase.functions.invoke('ai-tryon', {
        body: {
          userImage,
          productImage,
          prompt: "Create a realistic virtual try-on showing the person wearing this clothing item. Match the lighting, pose, and make it look natural."
        }
      });

      if (error) throw error;

      if (data?.tryonImage) {
        setTryonResult(data.tryonImage);
        toast({
          title: "Try-On Generated!",
          description: "Your virtual try-on is ready!",
        });
      }
    } catch (error: any) {
      console.error('Try-on error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate try-on. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-strong border border-primary/20">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Virtual Try-On
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Upload your photo and see how our products look on you with AI magic!
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-strong border-border/20 p-6 h-full">
            <h3 className="text-xl font-display font-bold text-foreground mb-4">
              1. Upload Your Photo
            </h3>
            
            {!userImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold mb-2">Click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src={userImage}
                    alt="Your photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUserImage(null);
                    setTryonResult(null);
                  }}
                  className="w-full border-border/20"
                >
                  Change Photo
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Product Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-strong border-border/20 p-6 h-full">
            <h3 className="text-xl font-display font-bold text-foreground mb-4">
              2. Select Product
            </h3>
            <div className="space-y-4">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedProduct(product.id)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedProduct === product.id
                      ? "ring-2 ring-primary shadow-lg shadow-primary/25"
                      : "glass border border-border/20"
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-foreground">
                        {product.name}
                      </h4>
                      {selectedProduct === product.id && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-sm text-primary">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button
                onClick={generateTryOn}
                disabled={!userImage || !selectedProduct || isGenerating}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg py-6 font-semibold rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Try-On
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-strong border-border/20 p-6 h-full">
            <h3 className="text-xl font-display font-bold text-foreground mb-4">
              3. Your Virtual Try-On
            </h3>
            
            {!tryonResult && !isGenerating && (
              <div className="aspect-[3/4] rounded-2xl glass border border-border/20 flex items-center justify-center">
                <div className="text-center p-6">
                  <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Your AI-generated try-on will appear here
                  </p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="aspect-[3/4] rounded-2xl glass border border-primary/30 flex items-center justify-center">
                <div className="text-center p-6">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-foreground font-semibold mb-2">Creating magic...</p>
                  <p className="text-sm text-muted-foreground">
                    This may take 10-30 seconds
                  </p>
                </div>
              </div>
            )}

            {tryonResult && !isGenerating && (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <img
                    src={tryonResult}
                    alt="Try-on result"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-strong border border-primary/20">
                    <span className="text-xs font-semibold text-primary">AI Generated</span>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-border/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border/20"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};