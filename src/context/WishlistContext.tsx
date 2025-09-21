
import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Tables } from '@/integrations/supabase/types';

type WishlistItem = Tables<'products'>;

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const addToWishlist = (product: WishlistItem) => {
    setWishlistItems(prevItems => {
      const isAlreadyInWishlist = prevItems.some(item => item.id === product.id);
      if (isAlreadyInWishlist) {
        // If it's already there, remove it
        return prevItems.filter(item => item.id !== product.id);
      } else {
        // Otherwise, add it
        toast({
          title: "Added to Wishlist! ❤️",
          description: `${product.title} has been saved.`,
        });
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Removed from Wishlist",
      description: "The item has been removed from your wishlist.",
      variant: 'destructive'
    });
  };

  const isWishlisted = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
