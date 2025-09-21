import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from '@/components/ui/toaster';

createRoot(document.getElementById('root')!).render(
  <CartProvider>
    <WishlistProvider>
      <App />
      <Toaster />
    </WishlistProvider>
  </CartProvider>
);
