import { useEffect } from 'react';
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderConfirmation = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when the user lands on this page
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-primary mb-4">Thank You!</h1>
      <p className="text-xl text-muted-foreground mb-8">Your order has been placed successfully.</p>
      <p className="text-muted-foreground mb-8">
        We've sent a confirmation and receipt to your email address.
      </p>
      <Button asChild size="lg">
        <Link to="/">Continue Shopping</Link>
      </Button>
    </div>
  );
};

export default OrderConfirmation;
