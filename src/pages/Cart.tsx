
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );
  
  // Example shipping and taxes
  const shipping = subtotal > 0 ? 50 : 0;
  const taxes = subtotal * 0.18; // 18% GST for example
  const total = subtotal + shipping + taxes;

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <Card key={item.id} className="flex items-center p-4">
              <img src={item.image_url || 'https://placehold.co/100x100'} alt={item.title} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-grow ml-4">
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-muted-foreground text-sm">₹{item.price?.toLocaleString("en-IN")}</p>
                <div className="flex items-center mt-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input type="number" value={item.quantity} readOnly className="w-16 text-center mx-2 h-8" />
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold text-lg">₹{(item.price || 0) * item.quantity.toLocaleString("en-IN")}</p>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive mt-2" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>₹{subtotal.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>₹{shipping.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex justify-between">
                <p>Taxes (GST)</p>
                <p>₹{taxes.toLocaleString("en-IN")}</p>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>₹{total.toLocaleString("en-IN")}</p>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
