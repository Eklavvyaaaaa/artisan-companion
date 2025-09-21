import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

type Inputs = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

const Checkout = () => {
  const { cartItems, cartCount, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<Inputs | null>(null);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<Inputs>();

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );

  // Using a fixed conversion rate for simplicity. 
  // In a real app, you would use a real-time exchange rate API.
  const USD_INR_RATE = 83.50;
  const subtotalUSD = subtotal / USD_INR_RATE;

  const shipping = subtotal > 0 ? 50 : 0;
  const shippingUSD = shipping / USD_INR_RATE;
  const taxes = subtotal * 0.18; // 18% GST
  const taxesUSD = taxes / USD_INR_RATE;
  const total = subtotal + shipping + taxes;
  const totalUSD = subtotalUSD + shippingUSD + taxesUSD;

  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (cartCount > 0) {
      setLoading(false);
    } else {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [cartCount]);

  const handleShippingSubmit: SubmitHandler<Inputs> = (data) => {
    setShippingInfo(data);
  };

  const createOrder = async () => {
    try {
        const { data, error } = await supabase.functions.invoke('paypal-create-order', {
            body: { 
                amount: totalUSD.toFixed(2), 
                currency: 'USD' 
            }
        });
        if (error) throw new Error(`Function error: ${error.message}`);
        if (!data.orderId) throw new Error("Failed to create PayPal order.");
        return data.orderId;
    } catch (err: any) {
        setError(`Could not create order: ${err.message}`);
        toast({ title: "Order Creation Error", description: err.message, variant: "destructive" });
        return null;
    }
  };

  const onApprove = async (data: any) => {
    setIsSubmitting(true);
    try {
        const { data: captureData, error } = await supabase.functions.invoke('paypal-capture-order', {
            body: { orderId: data.orderID }
        });
        
        if (error) throw new Error(`Function error: ${error.message}`);

        if (captureData.status === 'COMPLETED') {
            toast({ title: "Payment Successful", description: "Thank you for your order!" });
            clearCart();
            navigate("/order-confirmation");
        } else {
            throw new Error("Payment not completed.");
        }
    } catch (err: any) {
        setError(`Payment failed: ${err.message}`);
        toast({ title: "Payment Error", description: err.message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Preparing your order...</p>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">There's nothing to check out. Let's find something beautiful.</p>
        <Button asChild>
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Checkout</h1>
        {error && (
            <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...register("fullName", { required: "Full name is required" })} />
                    {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" } })} />
                    {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone", { required: "Phone number is required" })} />
                    {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address", { required: "Address is required" })} />
                    {errors.address && <p className="text-destructive text-sm">{errors.address.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city", { required: "City is required" })} />
                    {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("state", { required: "State is required" })} />
                    {errors.state && <p className="text-destructive text-sm">{errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="postalCode">PIN Code</Label>
                    <Input id="postalCode" {...register("postalCode", { required: "PIN code is required" })} />
                    {errors.postalCode && <p className="text-destructive text-sm">{errors.postalCode.message}</p>}
                </div>
                {!shippingInfo &&
                    <div className="md:col-span-2">
                         <Button type="button" className="w-full mt-4" onClick={async () => {
                             const result = await trigger();
                             if(result) handleSubmit(handleShippingSubmit)();
                         }}>Confirm Shipping</Button>
                    </div>
                }
                </CardContent>
            </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium">{item.title} <span className="text-muted-foreground">x{item.quantity}</span></p>
                            </div>
                            <p>₹{(item.price || 0) * item.quantity.toLocaleString("en-IN")}</p>
                        </div>
                    ))}
                    <div className="border-t pt-4 mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <p>Subtotal</p>
                            <p>₹{subtotal.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p>Shipping</p>
                            <p>₹{shipping.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p>Taxes</p>
                            <p>₹{taxes.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>₹{total.toLocaleString("en-IN")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {shippingInfo ? (
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    disabled={isSubmitting}
                />
            ) : (
                <p className="text-center text-muted-foreground">Please confirm your shipping info to proceed with payment.</p>
            )}
             {isSubmitting && (
                <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2">Processing payment...</p>
                </div>
            )}
            </div>
        </div>
        </div>
    </PayPalScriptProvider>
  );
}
  
  export default Checkout;
