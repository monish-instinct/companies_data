import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  Grid3X3,
  List,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

interface Product {
  id: string;
  title: string;
  price: number;
  mrp: number;
  images: string[];
  brand: string;
  category: string;
  stores: {
    name: string;
    rating: number;
  };
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'streetwear', name: 'Streetwear' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'casual', name: 'Casual' },
    { id: 'athleisure', name: 'Athleisure' },
    { id: 'luxury', name: 'Luxury' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'outerwear', name: 'Outerwear' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          mrp,
          images,
          brand,
          category,
          stores!inner (
            name,
            rating
          )
        `)
        .eq('is_available', true);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data: productsData } = await query;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CLOZET
            </span>
          </Link>
          <h1 className="text-lg font-semibold">Products</h1>
          <Link to="/dashboard">
            <Button variant="glass" size="sm">Dashboard</Button>
          </Link>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border-0 bg-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'hero' : 'glass'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'hero' : 'glass'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button variant="glass" size="sm">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'hero' : 'glass'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass hover:glass-strong transition-all duration-300 border-0 overflow-hidden group">
                  <div className="relative">
                    <div className={`${viewMode === 'grid' ? 'aspect-square' : 'aspect-video md:aspect-square'} bg-gradient-subtle rounded-lg overflow-hidden`}>
                      <img 
                        src={product.images[0] || '/placeholder.svg'} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="glass" size="sm" className="mr-1">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <Star className="w-3 h-3 text-accent fill-current" />
                        <span className="text-xs">{product.stores.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">₹{product.price}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                        <span className="text-xs text-accent font-medium">
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <Button variant="hero" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline-neon" size="sm">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-12"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
            <Button variant="hero" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;