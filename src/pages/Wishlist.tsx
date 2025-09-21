
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast({
      title: "Moved to Cart!",
      description: `${product.title} has been moved to your shopping cart.`,
    });
  };

  if (wishlistCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">You haven't saved any items yet. Let's find something you'll love!</p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map(item => (
          <Card key={item.id} className="overflow-hidden shadow-gentle">
            <div className="relative">
                <img src={item.image_url || 'https://placehold.co/600x400'} alt={item.title} className="w-full h-48 object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-accent font-bold text-xl mb-4">₹{item.price?.toLocaleString("en-IN")}</p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleMoveToCart(item)}><ShoppingCart className="mr-2 h-4 w-4"/> Move to Cart</Button>
                <Button variant="ghost" className="text-destructive" onClick={() => removeFromWishlist(item.id)}><Trash2 className="mr-2 h-4 w-4"/> Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
