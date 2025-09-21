
import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Info, MapPin, Filter, ChevronDown, ShoppingCart, Heart, ArrowUp, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/components/ui/use-toast";
import { getProducts } from '@/integrations/supabase/products';
import { Tables } from '@/integrations/supabase/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  return (
    <Card
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden shadow-gentle hover:shadow-craft transition-shadow duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img
          src={product.image_url || 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=No+Image'}
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.is_featured && (
          <Badge className="absolute top-2 left-2 bg-accent/90 text-primary-foreground font-semibold">New</Badge>
        )}
        <div
          className={cn(
            "absolute inset-0 bg-black/30 flex items-center justify-center gap-4 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="bg-primary/80 hover:bg-primary text-primary-foreground rounded-full transition-transform duration-300 scale-0 group-hover:scale-100"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Cart</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-card/80 hover:bg-card text-card-foreground rounded-full transition-transform duration-300 scale-0 group-hover:scale-100"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={cn("h-5 w-5", isWishlisted(product.id) && "fill-red-500 text-red-500")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
        <p className="text-muted-foreground text-sm">{/* Category removed */}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {product.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-primary-soft/30">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-2">
          {/* Rating removed for now */}
          <span className="text-xs text-muted-foreground ml-1">{/* Rating count removed */}</span>
        </div>
        <div className="text-accent font-bold mt-2">₹{product.price?.toLocaleString("en-IN")}</div>
        <p className="text-muted-foreground text-xs mt-1">{/* Location removed */}</p>
      </CardContent>
    </Card>
  );
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const { addToCart, cartCount } = useCart();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Tables<"products"> | null>(null);

  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      updatedProducts = updatedProducts.filter(product => {
        const { title, description, tags } = product;
        return (
          title.toLowerCase().includes(lowercasedQuery) ||
          (description && description.toLowerCase().includes(lowercasedQuery)) ||
          (tags && tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)))
        );
      });
    }

    switch (sortBy) {
      case "price-asc":
        updatedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        updatedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
        updatedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "relevance":
      default:
        // No change for relevance, keeps the original order or post-search order
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [products, searchQuery, sortBy]);

  const handleQuickView = (product: Tables<'products'>) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleScrollToTop = useCallback(() => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  }, []);

  const handleFilterBarScroll = useCallback(() => {
    if (isMobile) return;
    if (window.scrollY > lastScrollY && window.scrollY > 200) {
      setShowFilterBar(false);
    } else {
      setShowFilterBar(true);
    }
    setLastScrollY(window.scrollY);
  }, [isMobile, lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollToTop);
    if (!isMobile) {
      window.addEventListener('scroll', handleFilterBarScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScrollToTop);
      if (!isMobile) {
        window.removeEventListener('scroll', handleFilterBarScroll);
      }
    };
  }, [handleScrollToTop, handleFilterBarScroll, isMobile]);

  const handleResetFilters = () => {
    setSortBy("relevance");
  };

  const FilterSection = () => (
    <>
      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="sort-by" className="text-xs font-medium text-muted-foreground">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full text-sm mt-1">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleResetFilters} variant="outline" className="flex-1 min-w-[100px] text-sm lg:self-end">Clear All</Button>
    </>
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300",
          showScrollToTop ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )}
        size="icon"
      >
        <ArrowUp className="w-6 h-6" />
        <span className="sr-only">Scroll to top</span>
      </Button>

      <div className="flex flex-col gap-8">
        {!isMobile && (
          <div className={cn(
            "hidden lg:flex items-center gap-4 bg-card rounded-lg p-4 shadow-gentle sticky top-20 z-10 transition-opacity duration-300",
            showFilterBar ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <Filter className="w-5 h-5 text-primary" />
            <div className="flex items-center gap-4 flex-wrap">
              <FilterSection />
            </div>
          </div>
        )}

        {isMobile && (
           <div className="flex justify-between items-center lg:hidden mb-4 sticky top-16 z-10 bg-background/95 backdrop-blur py-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter & Sort
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filter & Sort</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                   <FilterSection />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        <main className="w-full space-y-12">
          <section>
             <div className="flex justify-center items-center mb-6 relative">
                <h2 className="text-2xl font-bold text-primary text-center">
                    {searchQuery ? `Searching for "${searchQuery}"` : 'All Products'}
                </h2>
                <Link to="/cart" className="absolute right-0 flex items-center gap-2 cursor-pointer">
                    <ShoppingCart className="w-6 h-6 text-gray-600"/>
                    <Badge variant="secondary" className="text-lg">{cartCount}</Badge>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />)
              ) : (
                <p className="text-center text-muted-foreground col-span-full">No products found.</p>
              )}
            </div>
          </section>
        </main>
      </div>
      
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-col md:flex-row items-start gap-4">
              <img src={selectedProduct.image_url || 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=No+Image'} alt={selectedProduct.title} className="w-full md:w-1/2 rounded-md object-cover" />
              <div className="flex-1 space-y-4 pt-4 md:pt-0">
                <DialogTitle className="text-3xl font-bold">{selectedProduct.title}</DialogTitle>
                <DialogDescription>
                  <p className="text-2xl font-bold text-accent mt-2">₹{selectedProduct.price?.toLocaleString("en-IN")}</p>
                </DialogDescription>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-primary-soft/30">{tag}</Badge>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <Button className="w-full" onClick={() => addToCart(selectedProduct)}>Add to Cart</Button>
                  <Button variant="outline" className="w-full mt-2">Contact Artisan</Button>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Products;
