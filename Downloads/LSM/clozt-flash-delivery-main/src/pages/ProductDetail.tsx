import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  Zap
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  mrp: number;
  images: string[];
  brand: string;
  category: string;
  material: string;
  care_instructions: string;
  variants: any;
  stores: {
    id: string;
    name: string;
    rating: number;
    logo_url: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data: productData } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          price,
          mrp,
          images,
          brand,
          category,
          material,
          care_instructions,
          variants,
          stores!inner (
            id,
            name,
            rating,
            logo_url
          )
        `)
        .eq('id', id)
        .single();

      if (productData) {
        setProduct(productData);
        if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product?.title} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product?.title} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button variant="hero">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <motion.header 
        className="glass-strong border-b border-border/20 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/products" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CLOZET
            </span>
          </Link>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div
            className="space-y-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="aspect-square bg-gradient-subtle rounded-2xl overflow-hidden">
              <img 
                src={product.images[selectedImage] || '/placeholder.svg'} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            className="space-y-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{product.brand}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">₹{product.price}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{product.mrp}</span>
                  <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-accent fill-current" />
                  <span className="font-medium">{product.stores.rating}</span>
                  <span className="text-muted-foreground">(245 reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{product.stores.name}</span>
                </div>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Available Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <Button
                      key={index}
                      variant={selectedVariant === variant ? 'hero' : 'outline-neon'}
                      size="sm"
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.size && `${variant.size} `}
                      {variant.color && `${variant.color}`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline-neon"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-medium px-4">{quantity}</span>
                <Button
                  variant="outline-neon"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="hero" size="xl" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant={isWishlisted ? "hero" : "outline-neon"} 
                size="xl"
                onClick={handleAddToWishlist}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Delivery Info */}
            <Card className="glass p-4 border-0">
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="w-5 h-5 text-accent" />
                <span className="font-semibold">Express Delivery Available</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4" />
                  <span>Delivered in 60 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>7-day easy returns</span>
                </div>
              </div>
            </Card>

            {/* Product Description */}
            <div>
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Material & Care */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Material</h3>
                <p className="text-muted-foreground text-sm">{product.material}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Care Instructions</h3>
                <p className="text-muted-foreground text-sm">{product.care_instructions}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;