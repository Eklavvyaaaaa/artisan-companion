import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  Users,
  MessageSquare,
  Calendar,
  MapPin,
  Star,
  Share2,
  Camera,
  Sparkles,
  Award,
  Clock,
  Globe,
  Quote,
  Instagram,
  Facebook,
  Twitter,
  Copy,
  Eye,
  Filter,
  ShoppingCart,
  ArrowUp,
  Info
} from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// We need to define the data directly here to avoid the import error.
const allProducts = [
  { name: 'Warli Art Painting', category: 'Handicrafts & Home Décor', price: 1500, tags: ['Folk Art', 'Painting', 'Handmade'], location: 'Palghar', imageUrl: 'https://placehold.co/600x400/ffe4e1/000000?text=Warli+Art', rating: 4.5, artisan: 'Sanjay Kulkarni', description: 'A beautiful Warli painting depicting a traditional village scene, hand-painted on canvas.', isNew: false },
  { name: 'Kolhapuri Chappals', category: 'Textiles & Handloom', price: 850, tags: ['Leather', 'Footwear', 'Traditional'], location: 'Kolhapur', imageUrl: 'https://placehold.co/600x400/f0f9ff/000000?text=Kolhapuri+Chappal', rating: 4.8, artisan: 'Shweta Deshmukh', description: 'Handcrafted Kolhapuri chappals made from authentic leather, perfect for ethnic wear.', isNew: false },
  { name: 'Paithani Saree', category: 'Textiles & Handloom', price: 12000, tags: ['Silk', 'Handloom', 'Saree'], location: 'Paithan', imageUrl: 'https://placehold.co/600x400/fffbe0/000000?text=Paithani+Saree', rating: 5.0, artisan: 'Rekha Patil', description: 'An exquisite silk Paithani saree with traditional peacock motifs, woven with love and care.', isNew: false },
  { name: 'Bidriware Pot', category: 'Handicrafts & Home Décor', price: 4500, tags: ['Metalwork', 'Inlay', 'Decor'], location: 'Aurangabad', imageUrl: 'https://placehold.co/600x400/f0fdf4/000000?text=Bidriware', rating: 4.2, artisan: 'Jitendra Singh', description: 'A handcrafted Bidriware pot, made from zinc and copper with intricate silver inlay work.', isNew: false },
  { name: 'Thanjavur Painting', category: 'Handicrafts & Home Décor', price: 7000, tags: ['Painting', 'Gold Leaf', 'Religious'], location: 'Thanjavur', imageUrl: 'https://placehold.co/600x400/d1c4e9/000000?text=Thanjavur', rating: 4.7, artisan: 'Laxmi Devi', description: 'A divine Thanjavur painting adorned with gold leaf and semi-precious stones.', isNew: false },
  { name: 'Pichwai Painting', category: 'Handicrafts & Home Décor', price: 6500, tags: ['Painting', 'Krishna', 'Decor'], location: 'Nathdwara', imageUrl: 'https://placehold.co/600x400/e3f2fd/000000?text=Pichwai', rating: 4.6, artisan: 'Laxmi Devi', description: 'A beautiful Pichwai painting depicting stories of Lord Krishna, hand-painted on cloth.', isNew: false },
  { name: 'Jaipuri Quilt', category: 'Textiles & Handloom', price: 3000, tags: ['Textile', 'Quilt', 'Block Print'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/fbe9e7/000000?text=Jaipuri+Quilt', rating: 4.9, artisan: 'Shweta Deshmukh', description: 'A soft and cozy Jaipuri quilt with a traditional block print design, perfect for a comfortable night’s sleep.', isNew: false },
  { name: 'Kalamkari Fabric', category: 'Textiles & Handloom', price: 900, tags: ['Textile', 'Hand-painted', 'Fabric'], location: 'Srikalahasti', imageUrl: 'https://placehold.co/600x400/f0f4c3/000000?text=Kalamkari', rating: 4.1, artisan: 'Shweta Deshmukh', description: 'A hand-painted Kalamkari fabric piece, ideal for creating custom clothing or decor.', isNew: false },
  { name: 'Dokra Art', category: 'Handicrafts & Home Décor', price: 2500, tags: ['Metalwork', 'Casting', 'Figurine'], location: 'Bastar', imageUrl: 'https://placehold.co/600x400/e8f5e9/000000?text=Dokra+Art', rating: 4.3, artisan: 'Jitendra Singh', description: 'A traditional Dokra metal art figurine, crafted using the ancient lost-wax technique.', isNew: false },
  { name: 'Blue Pottery', category: 'Handicrafts & Home Décor', price: 500, tags: ['Pottery', 'Ceramic', 'Handmade'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/e1f5fe/000000?text=Blue+Pottery', rating: 4.4, artisan: 'Priya Sharma', description: 'A beautifully hand-painted Blue Pottery bowl with intricate floral patterns.', isNew: false },
  { name: 'Lac Bangles', category: 'Jewellery & Accessories', price: 350, tags: ['Jewellery', 'Bangles', 'Traditional'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/f3e5f5/000000?text=Lac+Bangles', rating: 4.0, artisan: 'Priya Sharma', description: 'Vibrant and traditional lac bangles, adorned with delicate stone work.', isNew: false },
  { name: 'Meenakari Earrings', category: 'Jewellery & Accessories', price: 1200, tags: ['Jewellery', 'Enamel', 'Earrings'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/f9fbe7/000000?text=Meenakari', rating: 4.7, artisan: 'Priya Sharma', description: 'Elegant Meenakari earrings, showcasing detailed enamel work and a classic design.', isNew: false },
  { name: 'Gond Painting', category: 'Handicrafts & Home Décor', price: 2000, tags: ['Folk Art', 'Painting', 'Aboriginal'], location: 'Bhopal', imageUrl: 'https://placehold.co/600x400/fce4ec/000000?text=Gond+Art', rating: 4.5, artisan: 'Anand Kumar', description: 'A colorful Gond painting on canvas, depicting tribal life and nature in an abstract style.', isNew: false },
  { name: 'Phulkari Dupatta', category: 'Textiles & Handloom', price: 1800, tags: ['Embroidery', 'Dupatta', 'Traditional'], location: 'Patiala', imageUrl: 'https://placehold.co/600x400/d4e157/000000?text=Phulkari', rating: 4.8, artisan: 'Rekha Patil', description: 'A vibrant Phulkari dupatta with rich embroidery, a symbol of joy and celebration.', isNew: false },
  { name: 'Chanderi Saree', category: 'Textiles & Handloom', price: 5000, tags: ['Silk', 'Cotton', 'Handloom'], location: 'Chanderi', imageUrl: 'https://placehold.co/600x400/b2dfdb/000000?text=Chanderi', rating: 4.6, artisan: 'Sanjay Kulkarni', description: 'A lightweight and elegant Chanderi saree, known for its sheer texture and fine weaves.', isNew: false },
  { name: 'Dhokra Figurines', category: 'Handicrafts & Home Décor', price: 3000, tags: ['Metalwork', 'Casting', 'Figurine'], location: 'Nagpur', imageUrl: 'https://placehold.co/600x400/c5cae9/000000?text=Dhokra+Figurines', rating: 4.5, artisan: 'Jitendra Singh', description: 'Intricately crafted Dokra figurines, each one a unique piece of folk metal art.', isNew: false },
  { name: 'Rogan Painting', category: 'Handicrafts & Home Décor', price: 2500, tags: ['Painting', 'Castor Oil', 'Fabric'], location: 'Kutch', imageUrl: 'https://placehold.co/600x400/f8bbd0/000000?text=Rogan+Art', rating: 4.9, artisan: 'Anand Kumar', description: 'A beautiful Rogan painting on fabric, created using a thick, slow-drying paste made from castor oil.', isNew: false },
  { name: 'Sanjhi Paper Cutting', category: 'Handicrafts & Home Décor', price: 1800, tags: ['Paper Art', 'Cutting', 'Decor'], location: 'Mathura', imageUrl: 'https://placehold.co/600x400/ffecb3/000000?text=Sanjhi+Art', rating: 4.2, artisan: 'Laxmi Devi', description: 'A delicate Sanjhi paper cutting art piece, depicting scenes from Hindu mythology with precision and detail.', isNew: false },
  { name: 'Kansa Dinner Set', category: 'Handicrafts & Home Décor', price: 9000, tags: ['Metalwork', 'Bronze', 'Dinnerware'], location: 'Moradabad', imageUrl: 'https://placehold.co/600x400/b0bec5/000000?text=Kansa+Set', rating: 4.7, artisan: 'Jitendra Singh', description: 'A traditional Kansa dinner set, believed to have health benefits and a beautiful rustic charm.', isNew: false },
  { name: 'Patachitra Painting', category: 'Handicrafts & Home Décor', price: 4500, tags: ['Painting', 'Cloth-based', 'Narrative'], location: 'Puri', imageUrl: 'https://placehold.co/600x400/e6ee9c/000000?text=Patachitra', rating: 4.4, artisan: 'Manish Kumar', description: 'A traditional Patachitra painting on cloth, telling stories from the Hindu epics.', isNew: false },
  { name: 'Metal Musical Instruments', category: 'Musical Instruments', price: 3500, tags: ['Metal', 'Instrument', 'Wind'], location: 'Moradabad', imageUrl: 'https://placehold.co/600x400/cfd8dc/000000?text=Musical+Instrument', rating: 4.8, artisan: 'Jitendra Singh', description: 'A set of handcrafted metal musical instruments, perfect for traditional music.', isNew: false },
  { name: 'Mango Pickle', category: 'Traditional Food & Beverages', price: 150, tags: ['Food', 'Preserve', 'Spicy'], location: 'Mumbai', imageUrl: 'https://placehold.co/600x400/ffcc80/000000?text=Mango+Pickle', rating: 4.1, artisan: 'Shweta Deshmukh', description: 'A spicy and tangy mango pickle, homemade with traditional Konkan spices.', isNew: false },
  { name: 'Wooden Toy Car', category: 'Handwoven & Natural Products', price: 600, tags: ['Wood', 'Toy', 'Handmade'], location: 'Channapatna', imageUrl: 'https://placehold.co/600x400/d8c199/000000?text=Wooden+Toy', rating: 4.6, artisan: 'Anand Kumar', description: 'A vibrant and colorful wooden toy car, made from safe, non-toxic lacquer.', isNew: false },
  { name: 'Kalamkari Pen Stand', category: 'Handicrafts & Home Décor', price: 400, tags: ['Hand-painted', 'Decor', 'Stationery'], location: 'Srikalahasti', imageUrl: 'https://placehold.co/600x400/8d8d8d/000000?text=Pen+Stand', rating: 4.3, artisan: 'Shweta Deshmukh', description: 'A unique Kalamkari pen stand, hand-painted with intricate details.', isNew: false },
  { name: 'Brass Ganesh Idol', category: 'Metalware', price: 2500, tags: ['Metalwork', 'Idol', 'Religious'], location: 'Moradabad', imageUrl: 'https://placehold.co/600x400/e6a555/000000?text=Brass+Ganesh+Idol', rating: 4.9, artisan: 'Jitendra Singh', description: 'A beautifully sculpted Brass Ganesh Idol, perfect for your home altar or as a gift.', isNew: false },
  { name: 'Terracotta Vase', category: 'Pottery & Terracotta', price: 750, tags: ['Pottery', 'Clay', 'Decor'], location: 'Bastar', imageUrl: 'https://placehold.co/600x400/ac7b57/000000?text=Terracotta+Vase', rating: 4.7, artisan: 'Rekha Patil', description: 'A rustic terracotta vase with a traditional design, handcrafted by a skilled artisan.', isNew: false },
  { name: 'Pattachitra Wall Hanging', category: 'Handicrafts & Home Décor', price: 3500, tags: ['Painting', 'Cloth', 'Narrative'], location: 'Puri', imageUrl: 'https://placehold.co/600x400/9b9b9b/ffffff?text=Pattachitra+Wall+Hanging', rating: 4.6, artisan: 'Manish Kumar', description: 'A vibrant Pattachitra wall hanging depicting a mythological scene.', isNew: false },
  { name: 'Blue Enamel Bowl', category: 'Handicrafts & Home Décor', price: 800, tags: ['Pottery', 'Enamel', 'Bowl'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/4c7c9c/ffffff?text=Blue+Enamel+Bowl', rating: 4.4, artisan: 'Priya Sharma', description: 'A deep blue enamel bowl with intricate floral patterns, a classic piece of Jaipur Blue Pottery.', isNew: false },
  { name: 'Bamboo Flute', category: 'Musical Instruments', price: 450, tags: ['Bamboo', 'Flute', 'Music'], location: 'Guwahati', imageUrl: 'https://placehold.co/600x400/d1c9ac/000000?text=Bamboo+Flute', rating: 4.9, artisan: 'Ananya Roy', description: 'A lightweight bamboo flute, expertly crafted for a rich, melodious sound.', isNew: false },
  { name: 'Kalamkari Silk Scarf', category: 'Textiles & Handloom', price: 2200, tags: ['Silk', 'Scarf', 'Hand-painted'], location: 'Srikalahasti', imageUrl: 'https://placehold.co/600x400/e8e6d2/000000?text=Kalamkari+Silk+Scarf', rating: 4.7, artisan: 'Shweta Deshmukh', description: 'A delicate Kalamkari silk scarf, hand-painted with natural dyes.', isNew: false },
  { name: 'Brass Oil Lamp', category: 'Metalware', price: 1800, tags: ['Metalwork', 'Brass', 'Lamp'], location: 'Moradabad', imageUrl: 'https://placehold.co/600x400/a8a29e/ffffff?text=Brass+Oil+Lamp', rating: 4.8, artisan: 'Jitendra Singh', description: 'A traditional brass oil lamp, perfect for your puja room or as a decor piece.', isNew: false },
  { name: 'Gond Tree of Life', category: 'Handicrafts & Home Décor', price: 2800, tags: ['Folk Art', 'Painting', 'Nature'], location: 'Bhopal', imageUrl: 'https://placehold.co/600x400/9d7e7e/ffffff?text=Gond+Tree+of+Life', rating: 4.5, artisan: 'Anand Kumar', description: 'An intricate Gond painting of the Tree of Life, representing the interconnectedness of all things.', isNew: false },
  { name: 'Sanjhi Radha Krishna', category: 'Handicrafts & Home Décor', price: 2500, tags: ['Paper Art', 'Cutting', 'Religious'], location: 'Mathura', imageUrl: 'https://placehold.co/600x400/b8b8b8/000000?text=Sanjhi+Radha+Krishna', rating: 4.3, artisan: 'Laxmi Devi', description: 'A detailed Sanjhi paper cutting depicting Radha and Krishna, perfect for a spiritual atmosphere.', isNew: false },
  { name: 'Channapatna Wooden Dolls', category: 'Handwoven & Natural Products', price: 950, tags: ['Wood', 'Toy', 'Dolls'], location: 'Channapatna', imageUrl: 'https://placehold.co/600x400/d9b48c/000000?text=Wooden+Dolls', rating: 4.6, artisan: 'Anand Kumar', description: 'A set of colorful Channapatna wooden dolls, made with eco-friendly lacquer.', isNew: false },
  { name: 'Bidriware Coasters', category: 'Handicrafts & Home Décor', price: 1500, tags: ['Metalwork', 'Inlay', 'Home Decor'], location: 'Aurangabad', imageUrl: 'https://placehold.co/600x400/8d8d8d/ffffff?text=Bidriware+Coasters', rating: 4.4, artisan: 'Jitendra Singh', description: 'A set of Bidriware coasters with elegant silver inlay, a perfect blend of tradition and modern utility.', isNew: false },
  { name: 'Pattachitra Folk Stories', category: 'Handicrafts & Home Décor', price: 4200, tags: ['Painting', 'Cloth', 'Folk'], location: 'Puri', imageUrl: 'https://placehold.co/600x400/d6a361/000000?text=Pattachitra+Folk+Stories', rating: 4.8, artisan: 'Manish Kumar', description: 'A vibrant Pattachitra painting narrating a classic folk story on a palm leaf.', isNew: false },
  { name: 'Bamboo Basket Set', category: 'Handicrafts & Home Décor', price: 700, tags: ['Bamboo', 'Basketry', 'Handmade'], location: 'Tripura', imageUrl: 'https://placehold.co/600x400/c7a77e/000000?text=Bamboo+Basket+Set', rating: 4.1, artisan: 'Ananya Roy', description: 'A set of handwoven bamboo baskets, perfect for storage or as decorative items.', isNew: false },
  { name: 'Terracotta Ganesha Idol', category: 'Pottery & Terracotta', price: 1100, tags: ['Pottery', 'Clay', 'Religious'], location: 'Paithan', imageUrl: 'https://placehold.co/600x400/d9b3a3/000000?text=Terracotta+Ganesha+Idol', rating: 4.9, artisan: 'Rekha Patil', description: 'A beautifully sculpted Ganesha idol, hand-molded from natural terracotta clay.', isNew: false },
  { name: 'Meenakari Wall Plate', category: 'Handicrafts & Home Décor', price: 3200, tags: ['Enamel', 'Decor', 'Wall Art'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/805d76/ffffff?text=Meenakari+Wall+Plate', rating: 4.6, artisan: 'Priya Sharma', description: 'An intricately designed Meenakari wall plate with colorful enamel work, a perfect wall decor.', isNew: false },
  { name: 'Dokra Elephant Figurine', category: 'Handicrafts & Home Décor', price: 2900, tags: ['Metalwork', 'Casting', 'Figurine'], location: 'Nagpur', imageUrl: 'https://placehold.co/600x400/b09289/ffffff?text=Dokra+Elephant+Figurine', rating: 4.5, artisan: 'Jitendra Singh', description: 'A majestic Dokra elephant figurine, crafted with great attention to detail.', isNew: false },
  { name: 'Jaipuri Printed Bedspread', category: 'Textiles & Handloom', price: 4500, tags: ['Textile', 'Bedspread', 'Block Print'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/ffcdb2/000000?text=Jaipuri+Bedspread', rating: 4.8, artisan: 'Shweta Deshmukh', description: 'A vibrant Jaipuri bedspread with hand-printed motifs, bringing a touch of Rajasthan to your bedroom.', isNew: false },
  { name: 'Gond Peacock Painting', category: 'Handicrafts & Home Décor', price: 2700, tags: ['Folk Art', 'Painting', 'Nature'], location: 'Bhopal', imageUrl: 'https://placehold.co/600x400/a3ccab/000000?text=Gond+Peacock+Painting', rating: 4.7, artisan: 'Anand Kumar', description: 'A stunning Gond painting of a peacock, symbolizing beauty and spirituality.', isNew: false },
  { name: 'Kalamkari Block Print Saree', category: 'Textiles & Handloom', price: 8500, tags: ['Silk', 'Handloom', 'Saree'], location: 'Srikalahasti', imageUrl: 'https://placehold.co/600x400/f5efc9/000000?text=Kalamkari+Saree', rating: 4.9, artisan: 'Shweta Deshmukh', description: 'An elegant Kalamkari saree with a block-printed design, a perfect blend of tradition and style.', isNew: false },
  { name: 'Brass Nandi Idol', category: 'Metalware', price: 4000, tags: ['Metalwork', 'Brass', 'Religious'], location: 'Moradabad', imageUrl: 'https://placehold.co/600x400/b59489/ffffff?text=Brass+Nandi+Idol', rating: 4.9, artisan: 'Jitendra Singh', description: 'A detailed brass Nandi idol, a traditional representation of divine devotion.', isNew: false },
  { name: 'Rogan Tree of Life', category: 'Handicrafts & Home Décor', price: 3800, tags: ['Painting', 'Castor Oil', 'Fabric'], location: 'Kutch', imageUrl: 'https://placehold.co/600x400/8f7762/ffffff?text=Rogan+Tree+of+Life', rating: 4.8, artisan: 'Anand Kumar', description: 'A mesmerizing Rogan painting of the Tree of Life, a unique folk art from Kutch.', isNew: false },
  { name: 'Sanjhi Lotus Lamp', category: 'Handicrafts & Home Décor', price: 2100, tags: ['Paper Art', 'Cutting', 'Lighting'], location: 'Mathura', imageUrl: 'https://placehold.co/600x400/e0d9b4/000000?text=Sanjhi+Lotus+Lamp', rating: 4.4, artisan: 'Laxmi Devi', description: 'A delicate Sanjhi paper lantern, hand-cut from paper and lit from within to create a beautiful ambiance.', isNew: false },
  { name: 'Thanjavur Ganesha Painting', category: 'Handicrafts & Home Décor', price: 9500, tags: ['Painting', 'Gold Leaf', 'Religious'], location: 'Thanjavur', imageUrl: 'https://placehold.co/600x400/f5f5dc/000000?text=Thanjavur+Ganesha', rating: 4.9, artisan: 'Laxmi Devi', description: 'A stunning Thanjavur painting of Lord Ganesha, featuring intricate gold leaf and vibrant colors.', isNew: false },
  { name: 'Kolhapuri Silver Necklace', category: 'Jewellery & Accessories', price: 2800, tags: ['Jewellery', 'Silver', 'Necklace'], location: 'Kolhapur', imageUrl: 'https://placehold.co/600x400/d7d7d7/000000?text=Kolhapuri+Silver+Necklace', rating: 4.7, artisan: 'Priya Sharma', description: 'A classic Kolhapuri silver necklace, with intricate designs inspired by local culture.', isNew: false },
  { name: 'Warli Village Scene', category: 'Handicrafts & Home Décor', price: 1800, tags: ['Folk Art', 'Painting', 'Handmade'], location: 'Palghar', imageUrl: 'https://placehold.co/600x400/e9e3c9/000000?text=Warli+Village+Scene', rating: 4.6, artisan: 'Sanjay Kulkarni', description: 'A detailed Warli painting depicting the daily life of a village in Maharashtra.', isNew: false },
  { name: 'Channapatna Wooden Train Set', category: 'Handwoven & Natural Products', price: 1200, tags: ['Wood', 'Toy', 'Handmade'], location: 'Channapatna', imageUrl: 'https://placehold.co/600x400/b88b4a/000000?text=Wooden+Train+Set', rating: 4.7, artisan: 'Anand Kumar', description: 'A beautifully crafted wooden train set from Channapatna, perfect for kids.', isNew: false },
  { name: 'Patachitra Mahabharata Scene', category: 'Handicrafts & Home Décor', price: 5500, tags: ['Painting', 'Cloth-based', 'Narrative'], location: 'Puri', imageUrl: 'https://placehold.co/600x400/a39595/ffffff?text=Patachitra+Mahabharata+Scene', rating: 4.8, artisan: 'Manish Kumar', description: 'An epic Patachitra painting depicting a scene from the Mahabharata.', isNew: false },
  { name: 'Clay Serving Bowl', category: 'Pottery & Terracotta', price: 650, tags: ['Pottery', 'Ceramics', 'Handmade'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/c2c2c2/000000?text=Clay+Serving+Bowl', rating: 4.5, artisan: 'Sunita Verma', description: 'A simple yet elegant clay serving bowl, hand-shaped and fired to perfection.', isNew: false },
  { name: 'Hand-Painted Ceramic Mug', category: 'Pottery & Terracotta', price: 450, tags: ['Pottery', 'Ceramics', 'Handmade'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/f3f3f3/000000?text=Hand-Painted+Ceramic+Mug', rating: 4.6, artisan: 'Sunita Verma', description: 'A vibrant hand-painted ceramic mug, perfect for your morning coffee.', isNew: false },
  { name: 'Terracotta Bell Wind Chime', category: 'Pottery & Terracotta', price: 800, tags: ['Pottery', 'Clay', 'Decor'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/e9d0b6/000000?text=Terracotta+Wind+Chime', rating: 4.7, artisan: 'Sunita Verma', description: 'A soothing terracotta wind chime, hand-molded for a gentle, melodic sound.', isNew: false },
  { name: 'Metal Embossed Tray', category: 'Metalware', price: 3200, tags: ['Metalwork', 'Embossed', 'Decor'], location: 'Moradabad', imageUrl: 'https://placehold.co/600x400/c0c0c0/000000?text=Metal+Embossed+Tray', rating: 4.5, artisan: 'Jitendra Singh', description: 'An ornate metal embossed tray, perfect for serving guests or as a decorative piece.', isNew: false },
  { name: 'Meenakari Jhumkas', category: 'Jewellery & Accessories', price: 1500, tags: ['Jewellery', 'Enamel', 'Earrings'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/f8c8dc/000000?text=Meenakari+Jhumkas', rating: 4.8, artisan: 'Priya Sharma', description: 'Traditional Meenakari jhumkas with colorful enamel work, a timeless accessory.', isNew: false },
  { name: 'Bamboo Serving Platter', category: 'Handwoven & Natural Products', price: 900, tags: ['Bamboo', 'Kitchen', 'Handmade'], location: 'Guwahati', imageUrl: 'https://placehold.co/600x400/d7e3a9/000000?text=Bamboo+Platter', rating: 4.4, artisan: 'Ananya Roy', description: 'A handwoven bamboo serving platter, perfect for a rustic dining experience.', isNew: false },
  { name: 'Chanderi Silk Stole', category: 'Textiles & Handloom', price: 2500, tags: ['Silk', 'Stole', 'Handloom'], location: 'Chanderi', imageUrl: 'https://placehold.co/600x400/e0d8c2/000000?text=Chanderi+Silk+Stole', rating: 4.6, artisan: 'Sanjay Kulkarni', description: 'A delicate Chanderi silk stole with a soft, sheer texture and a simple, elegant design.', isNew: false },
  { name: 'Warli Themed Coasters', category: 'Handicrafts & Home Décor', price: 500, tags: ['Folk Art', 'Handmade', 'Home Decor'], location: 'Palghar', imageUrl: 'https://placehold.co/600x400/ffefd5/000000?text=Warli+Coasters', rating: 4.3, artisan: 'Sanjay Kulkarni', description: 'A set of Warli themed coasters, hand-painted to bring a touch of folk art to your home.', isNew: false },
  { name: 'Patachitra Saree', category: 'Textiles & Handloom', price: 10000, tags: ['Painting', 'Cloth', 'Saree'], location: 'Puri', imageUrl: 'https://placehold.co/600x400/c7b299/000000?text=Patachitra+Saree', rating: 4.9, artisan: 'Manish Kumar', description: 'An exquisite Patachitra saree, hand-painted with mythological scenes.', isNew: false },
  { name: 'Pichwai Cow Painting', category: 'Handicrafts & Home Décor', price: 7500, tags: ['Painting', 'Krishna', 'Decor'], location: 'Nathdwara', imageUrl: 'https://placehold.co/600x400/e6e6fa/000000?text=Pichwai+Cow+Painting', rating: 4.8, artisan: 'Laxmi Devi', description: 'A beautiful Pichwai painting depicting a cow, a sacred symbol of Krishna.', isNew: false },
  { name: 'Sanjhi Paper Lantern', category: 'Handicrafts & Home Décor', price: 1900, tags: ['Paper Art', 'Cutting', 'Lighting'], location: 'Mathura', imageUrl: 'https://placehold.co/600x400/d0d0d0/000000?text=Sanjhi+Lantern', rating: 4.5, artisan: 'Laxmi Devi', description: 'A delicate Sanjhi paper lantern, intricately cut to create beautiful patterns when lit.', isNew: false },
  { name: 'Bamboo Pen Stand', category: 'Handicrafts & Home Décor', price: 300, tags: ['Bamboo', 'Stationery', 'Handmade'], location: 'Tripura', imageUrl: 'https://placehold.co/600x400/b8b8b8/000000?text=Bamboo+Pen+Stand', rating: 4.2, artisan: 'Ananya Roy', description: 'A handwoven bamboo pen stand, perfect for a natural touch to your workspace.', isNew: false },
  { name: 'Gond Deer Painting', category: 'Handicrafts & Home Décor', price: 2300, tags: ['Folk Art', 'Painting', 'Nature'], location: 'Bhopal', imageUrl: 'https://placehold.co/600x400/8d8d8d/000000?text=Gond+Deer+Painting', rating: 4.6, artisan: 'Anand Kumar', description: 'A vibrant Gond painting of a deer, symbolizing strength and grace in tribal art.', isNew: false },
  { name: 'Kolhapuri Silver Necklace', category: 'Jewellery & Accessories', price: 2800, tags: ['Jewellery', 'Silver', 'Necklace'], location: 'Kolhapur', imageUrl: 'https://placehold.co/600x400/d7d7d7/000000?text=Kolhapuri+Silver+Necklace', rating: 4.7, artisan: 'Priya Sharma', description: 'A classic Kolhapuri silver necklace, with intricate designs inspired by local culture.', isNew: false },
  { name: 'Miniature Palace Scene', category: 'Handicrafts & Home Décor', price: 6000, tags: ['Painting', 'Miniature', 'Royal'], location: 'Udaipur', imageUrl: 'https://placehold.co/600x400/f3e8ff/000000?text=Miniature+Palace+Scene', rating: 4.9, artisan: 'Kavita Singh', description: 'A breathtaking miniature painting depicting a royal palace scene from Udaipur.', isNew: false },
  { name: 'Hand-Painted Silk Bookmark', category: 'Handicrafts & Home Décor', price: 350, tags: ['Miniature', 'Painting', 'Silk'], location: 'Udaipur', imageUrl: 'https://placehold.co/600x400/e9e3c9/000000?text=Hand-Painted+Silk+Bookmark', rating: 4.5, artisan: 'Kavita Singh', description: 'A delicate hand-painted silk bookmark, perfect for any book lover.', isNew: false },
  { name: 'Rajasthani Miniature Art', category: 'Handicrafts & Home Décor', price: 4500, tags: ['Painting', 'Miniature', 'Nature'], location: 'Udaipur', imageUrl: 'https://placehold.co/600x400/d1c4e9/000000?text=Rajasthani+Miniature+Art', rating: 4.8, artisan: 'Kavita Singh', description: 'A vibrant Rajasthani miniature painting, showcasing the rich flora and fauna of the region.', isNew: false },
  { name: 'Blue Pottery Mug', category: 'Pottery & Terracotta', price: 550, tags: ['Pottery', 'Ceramic', 'Handmade'], location: 'Jaipur', imageUrl: 'https://placehold.co/600x400/add8e6/000000?text=Blue+Pottery+Mug', rating: 4.4, artisan: 'Priya Sharma', description: 'A unique Blue Pottery mug, hand-painted with traditional geometric patterns.', isNew: false },
  { name: 'Terracotta T-Light Holder', category: 'Pottery & Terracotta', price: 400, tags: ['Pottery', 'Clay', 'Decor'], location: 'Bhuj', imageUrl: 'https://placehold.co/600x400/a07a61/000000?text=Terracotta+T-Light+Holder', rating: 4.6, artisan: 'Rahul Desai', description: 'A rustic terracotta T-light holder, perfect for creating a cozy atmosphere.', isNew: false },
  { name: 'Hand-Painted Ceramic Plate', category: 'Pottery & Terracotta', price: 800, tags: ['Pottery', 'Ceramics', 'Handmade'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/f0f8ff/000000?text=Hand-Painted+Ceramic+Plate', rating: 4.5, artisan: 'Sunita Verma', description: 'A beautifully hand-painted ceramic plate with intricate designs.', isNew: false },
  { name: 'Clay Wind Chime', category: 'Pottery & Terracotta', price: 700, tags: ['Pottery', 'Clay', 'Decor'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/e6e6fa/000000?text=Clay+Wind+Chime', rating: 4.7, artisan: 'Sunita Verma', description: 'A soothing clay wind chime, handmade to create a beautiful sound.', isNew: false },
  { name: 'Bhuj Pottery Vase', category: 'Pottery & Terracotta', price: 1200, tags: ['Pottery', 'Clay', 'Decor'], location: 'Bhuj', imageUrl: 'https://placehold.co/600x400/a56c5e/000000?text=Bhuj+Pottery+Vase', rating: 4.8, artisan: 'Rahul Desai', description: 'A unique Bhuj pottery vase, showcasing the traditional clay art of Gujarat.', isNew: false },
  { name: 'Ceramic Planter', category: 'Pottery & Terracotta', price: 950, tags: ['Pottery', 'Ceramics', 'Decor'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/b4c4c8/000000?text=Ceramic+Planter', rating: 4.6, artisan: 'Sunita Verma', description: 'A beautiful ceramic planter, perfect for adding a touch of green to your home.', isNew: false },
  { name: 'Gujarat Terracotta Figurine', category: 'Pottery & Terracotta', price: 600, tags: ['Pottery', 'Clay', 'Handmade'], location: 'Bhuj', imageUrl: 'https://placehold.co/600x400/c7a77e/000000?text=Gujarat+Terracotta+Figurine', rating: 4.5, artisan: 'Rahul Desai', description: 'A traditional Gujarat terracotta figurine, handcrafted with great detail.', isNew: false },
  { name: 'Miniature Elephant on Silk', category: 'Handicrafts & Home Décor', price: 3800, tags: ['Painting', 'Miniature', 'Silk'], location: 'Udaipur', imageUrl: 'https://placehold.co/600x400/f3e8ff/000000?text=Miniature+Elephant', rating: 4.7, artisan: 'Kavita Singh', description: 'An intricate miniature painting of an elephant on silk, a symbol of royalty.', isNew: false },
  { name: 'Hand-painted wooden bird', category: 'Handwoven & Natural Products', price: 400, tags: ['Wood', 'Toy', 'Handmade'], location: 'Channapatna', imageUrl: 'https://placehold.co/600x400/e9e3c9/000000?text=Wooden+Bird', rating: 4.5, artisan: 'Anand Kumar', description: 'A colorful hand-painted wooden bird, perfect as a small gift or decor piece.', isNew: false },
  { name: 'Bhuj Traditional Terracotta Lamp', category: 'Pottery & Terracotta', price: 750, tags: ['Pottery', 'Clay', 'Lighting'], location: 'Bhuj', imageUrl: 'https://placehold.co/600x400/d7e3a9/000000?text=Terracotta+Lamp', rating: 4.8, artisan: 'Rahul Desai', description: 'A traditional Bhuj terracotta lamp, perfect for creating a warm and inviting atmosphere.', isNew: false },
  { name: 'Indore Ceramic Dinner Set', category: 'Pottery & Terracotta', price: 2500, tags: ['Pottery', 'Ceramics', 'Dinnerware'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/b7c9d1/000000?text=Ceramic+Dinner+Set', rating: 4.6, artisan: 'Sunita Verma', description: 'A beautifully crafted ceramic dinner set, hand-painted with traditional patterns.', isNew: false },
  { name: 'Miniature Camel on Paper', category: 'Handicrafts & Home Décor', price: 1800, tags: ['Painting', 'Miniature', 'Paper'], location: 'Udaipur', imageUrl: 'https://placehold.co/600x400/f8bbd0/000000?text=Miniature+Camel', rating: 4.6, artisan: 'Kavita Singh', description: 'A charming miniature painting of a camel on paper, a classic Rajasthani motif.', isNew: false },
  { name: 'Chanderi Dupatta', category: 'Textiles & Handloom', price: 2800, tags: ['Silk', 'Cotton', 'Handloom'], location: 'Chanderi', imageUrl: 'https://placehold.co/600x400/f0f4c3/000000?text=Chanderi+Dupatta', rating: 4.7, artisan: 'Sanjay Kulkarni', description: 'A delicate Chanderi dupatta with a beautiful handloom weave.', isNew: false },
  { name: 'Handcrafted Wooden Clock', category: 'Handwoven & Natural Products', price: 1200, tags: ['Wood', 'Clock', 'Decor'], location: 'Channapatna', imageUrl: 'https://placehold.co/600x400/964B00/ffffff?text=Wooden+Clock', rating: 4.5, artisan: 'Anand Kumar', description: 'A beautifully designed Handcrafted Wooden Clock from Channapatna.', isNew: true },
  { name: 'Terracotta Planter Pot', category: 'Pottery & Terracotta', price: 400, tags: ['Pottery', 'Clay', 'Decor'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/e9d0b6/000000?text=Terracotta+Planter+Pot', rating: 4.7, artisan: 'Sunita Verma', description: 'A traditional Terracotta Planter Pot for your home garden.', isNew: true },
  { name: 'Hand-painted Ceramic Mug', category: 'Pottery & Terracotta', price: 450, tags: ['Pottery', 'Ceramics', 'Handmade'], location: 'Indore', imageUrl: 'https://placehold.co/600x400/f3f3f3/000000?text=Hand-Painted+Ceramic+Mug', rating: 4.6, artisan: 'Sunita Verma', description: 'A vibrant hand-painted ceramic mug, perfect for your morning coffee.', isNew: false },
  { name: 'Dokra Fish Figurine', category: 'Handicrafts & Home Décor', price: 1800, tags: ['Metalwork', 'Casting', 'Figurine'], location: 'Nagpur', imageUrl: 'https://placehold.co/600x400/b09289/ffffff?text=Dokra+Fish+Figurine', rating: 4.4, artisan: 'Jitendra Singh', description: 'A small Dokra fish figurine, perfect as a paperweight or decor.', isNew: true },
];

const featuredArtisans = [
  {
    name: 'Jitendra Singh',
    specialty: 'Bidriware, Dhokra Art',
    location: 'Aurangabad, Maharashtra',
    imageUrl: 'https://placehold.co/100x100/f0f9ff/000000?text=JS',
    bio: 'Jitendra is a master of Bidriware, a traditional metal inlay craft. His family has practiced this art for generations, blending zinc with intricate silver and gold patterns to create breathtaking pieces of decor and utility. He also works with the ancient lost-wax casting technique of Dokra art.',
  },
  {
    name: 'Rekha Patil',
    specialty: 'Paithani Sarees, Terracotta',
    location: 'Paithan, Maharashtra',
    imageUrl: 'https://placehold.co/100x100/fffbe0/000000?text=RP',
    bio: 'Rekha is a skilled weaver of Paithani sarees, known for their elaborate peacock and floral motifs. She also explores her creativity in terracotta pottery, creating rustic yet elegant home decor inspired by local traditions.',
  },
  {
    name: 'Sanjay Kulkarni',
    specialty: 'Warli Art, Textiles',
    location: 'Palghar, Maharashtra',
    imageUrl: 'https://placehold.co/100x100/ffe4e1/000000?text=SK',
    bio: 'Sanjay brings the ancient art of Warli to life, depicting scenes of daily life, nature, and mythology through simple geometric shapes. His work is a tribute to the rich cultural heritage of the Warli tribe, often incorporating these patterns into textiles.',
  },
  {
    name: 'Anand Kumar',
    specialty: 'Wooden Toys, Folk Paintings',
    location: 'Channapatna, Karnataka',
    imageUrl: 'https://placehold.co/100x100/d8c199/000000?text=AK',
    bio: 'Anand is a renowned artist of Channapatna wooden toys, famous for their vibrant, non-toxic lacquer finish. He also practices various folk painting styles, including Gond and Patachitra, celebrating the diversity of Indian art through color and form.',
  },
  {
    name: 'Priya Sharma',
    specialty: 'Jewellery, Blue Pottery',
    location: 'Jaipur, Rajasthan',
    imageUrl: 'https://placehold.co/100x100/fce4ec/000000?text=PS',
    bio: 'Priya specializes in traditional Rajasthani Meenakari jewellery and Blue Pottery. She combines vibrant enamel colors with delicate silverwork and a traditional blue glaze to create unique and eye-catching pieces that tell a story of royal heritage.',
  },
  {
    name: 'Shweta Deshmukh',
    specialty: 'Textiles, Traditional Food',
    location: 'Mumbai, Maharashtra',
    imageUrl: 'https://placehold.co/100x100/b2dfdb/000000?text=SD',
    bio: 'Shweta is a versatile artisan who crafts intricate textiles like Jaipuri quilts and Kalamkari fabrics. She also has a passion for traditional food, preparing authentic Konkan-style delicacies that connect people to their roots through taste.',
  },
  {
    name: 'Manish Kumar',
    specialty: 'Pattachitra Painting',
    location: 'Puri, Odisha',
    imageUrl: 'https://placehold.co/100x100/e6e6fa/000000?text=MK',
    bio: 'Manish is a custodian of the ancient Pattachitra art form, creating detailed, narrative paintings on cloth. His work often depicts mythological stories and folklore with vibrant, natural colors, preserving a centuries-old tradition.',
  },
  {
    name: 'Ananya Roy',
    specialty: 'Bamboo Crafts, Musical Instruments',
    location: 'Guwahati, Assam',
    imageUrl: 'https://placehold.co/100x100/b7e4c7/000000?text=AR',
    bio: 'Ananya is an artisan dedicated to the craft of bamboo, creating not only beautiful home decor but also traditional musical instruments like flutes. Her work highlights the versatility and sustainability of bamboo as a material.',
  },
  {
    name: 'Laxmi Devi',
    specialty: 'Folk Paintings, Paper Art',
    location: 'Madurai, Tamil Nadu',
    imageUrl: 'https://placehold.co/100x100/d9b48c/000000?text=LD',
    bio: 'Laxmi is a master of several folk painting traditions from South India, including the exquisite Thanjavur art. She also specializes in Sanjhi paper cutting, creating delicate and intricate paper art depicting religious motifs.',
  },
  {
    name: 'Rahul Desai',
    specialty: 'Pottery, Terracotta',
    location: 'Bhuj, Gujarat',
    imageUrl: 'https://placehold.co/100x100/b0bec5/000000?text=RD',
    bio: 'Rahul practices the traditional pottery of Gujarat, known for its distinct styles and vibrant earth tones. He creates a range of terracotta products from functional pottery to decorative art pieces.',
  },
  {
    name: 'Kavita Singh',
    specialty: 'Miniature Painting',
    location: 'Udaipur, Rajasthan',
    imageUrl: 'https://placehold.co/100x100/8d8d8d/000000?text=KS',
    bio: 'Kavita is a skilled miniature painter, creating intricate and detailed paintings on various materials like paper and silk. Her work often depicts scenes from royal courts and nature with fine brushwork and natural pigments.',
  },
  {
    name: 'Sunita Verma',
    specialty: 'Clay & Ceramics',
    location: 'Indore, Madhya Pradesh',
    imageUrl: 'https://placehold.co/100x100/f1d7d0/000000?text=SV',
    bio: 'Sunita specializes in traditional clay and ceramic art, hand-shaping and painting each piece to perfection. Her creations range from functional dinnerware to beautiful decorative items, all inspired by the rich cultural heritage of Madhya Pradesh.',
  }
];

// Data for India-centric testimonials
const testimonials = [
  {
    id: 1,
    name: "Aparna Rao",
    location: "Hyderabad, India",
    rating: 5,
    message: "The Kalamkari Saree I bought is a masterpiece. The intricate hand-painted designs tell an ancient story, and wearing it feels like carrying a piece of our heritage. The artisan's dedication is truly remarkable.",
    product: "Kalamkari Block Print Saree"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Jaipur, India",
    rating: 5,
    message: "I commissioned a custom miniature painting, and the result exceeded all my expectations. The detail and fine brushwork are incredible. It's a true work of art that captures the essence of Rajasthan's royal history.",
    product: "Rajasthani Miniature Art"
  },
  {
    id: 3,
    name: "Sonia Gupta",
    location: "Delhi, India",
    rating: 5,
    message: "The handcrafted Dokra art figurine brings so much warmth to my home. Knowing it was made using a centuries-old lost-wax technique makes it even more special. It's a perfect blend of tradition and timeless beauty.",
    product: "Dokra Elephant Figurine"
  },
  {
    id: 4,
    name: "Aditi Sharma",
    location: "Pune, India",
    rating: 5,
    message: "The handwoven Paithani saree is simply stunning. The colors are vibrant, and the peacock motifs are woven with such precision. It's an heirloom piece I will cherish for a lifetime.",
    product: "Paithani Saree"
  },
  {
    id: 5,
    name: "Vikram Singh",
    location: "Mumbai, India",
    rating: 5,
    message: "In a world of mass-produced goods, finding authentic craftsmanship is a treasure. This hand-painted ceramic dinner set is perfect. Guests always ask about its story, and I proudly share the artisan's journey.",
    product: "Indore Ceramic Dinner Set"
  }
];

// Data for India-centric upcoming events
const allEvents = [
  {
    id: 1,
    title: "Paithani Saree Weaving Workshop",
    date: "2024-02-15",
    time: "10:00 AM",
    location: "Community Center, Mumbai",
    host: "Rekha Patil",
    attendees: 24,
    maxAttendees: 30,
    description: "Learn the intricate art of weaving a traditional Paithani saree with master artisan Rekha Patil.",
    mode: "offline"
  },
  {
    id: 2,
    title: "Dokra Art Showcase & Sale",
    date: "2024-02-20",
    time: "9:00 AM",
    location: "Central Plaza, Nagpur",
    host: "Jitendra Singh",
    attendees: 156,
    maxAttendees: 200,
    description: "Witness the ancient lost-wax casting technique and purchase unique Dokra art pieces.",
    mode: "offline"
  },
  {
    id: 3,
    title: "Digital Storytelling for Artisans",
    date: "2024-02-25",
    time: "2:00 PM",
    location: "Online Webinar",
    host: "Artisan Companion Team",
    attendees: 89,
    maxAttendees: 100,
    description: "Learn to share your craft's story through digital media and connect with a wider audience.",
    mode: "online"
  },
  {
    id: 4,
    title: "Traditional Block Printing Workshop",
    date: "2024-03-05",
    time: "11:00 AM",
    location: "Art Studio, Jaipur",
    host: "Shweta Deshmukh",
    attendees: 15,
    maxAttendees: 20,
    description: "Hands-on workshop to learn the art of block printing on textiles using natural dyes.",
    mode: "offline"
  },
  {
    id: 5,
    title: "Terracotta Pottery Masterclass",
    date: "2024-03-10",
    time: "3:00 PM",
    location: "Artisan Studio, Pune",
    host: "Rahul Desai",
    attendees: 10,
    maxAttendees: 15,
    description: "A masterclass on traditional terracotta pottery, from molding to firing.",
    mode: "offline"
  },
  {
    id: 6,
    title: "Gond Art Painting Session",
    date: "2024-03-15",
    time: "1:00 PM",
    location: "Bhopal Tribal Museum",
    host: "Anand Kumar",
    attendees: 30,
    maxAttendees: 40,
    description: "An immersive session on the unique and colorful art of Gond painting.",
    mode: "offline"
  },
  {
    id: 7,
    title: "Meenakari Jewelry Design",
    date: "2024-03-20",
    time: "11:00 AM",
    location: "Online Workshop",
    host: "Priya Sharma",
    attendees: 50,
    maxAttendees: 50,
    description: "Learn the basics of Meenakari enamel work to create stunning jewelry.",
    mode: "online"
  }
];

const communityStats = [
  { label: "Active Artisans", value: "2,847", icon: Users },
  { label: "Completed Projects", value: "15,632", icon: Award },
  { label: "Community Events", value: "324", icon: Calendar },
  { label: "States Represented", value: "28", icon: Globe }
];

const socialPosts = [
  {
    platform: "Instagram",
    icon: Instagram,
    content: "✨ This is more than just a painting, it's a story. Each line in this Warli art piece tells a tale of daily life, nature, and community. Inspired by the rich heritage of Maharashtra. 🎨 #WarliArt #IndianFolkArt #ArtisanCraft #Maharashtra",
    hashtags: "#WarliArt #IndianFolkArt #ArtisanCraft #Maharashtra",
    engagement: "Perfect for Instagram Stories & Posts"
  },
  {
    platform: "Facebook",
    icon: Facebook,
    content: "Behind every piece of meenakari jewelry lies centuries of royal tradition. The vibrant colors and delicate patterns are a tribute to the skilled artisans of Jaipur. When you wear this jewelry, you are wearing a piece of history. #Meenakari #Jaipur #CulturalHeritage #JewelryMaking",
    hashtags: "#Meenakari #Jaipur #CulturalHeritage #JewelryMaking",
    engagement: "Great for storytelling posts"
  },
  {
    platform: "Twitter",
    icon: Twitter,
    content: "Handcrafted wooden toys from Channapatna! Made with non-toxic lacquer, these toys are not only safe but also a symbol of sustainable craftsmanship. #ChannapatnaToys #WoodenToys #IndianCrafts",
    hashtags: "#ChannapatnaToys #WoodenToys #IndianCrafts",
    engagement: "Perfect tweet length"
  }
];

const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="overflow-hidden shadow-gentle hover:shadow-craft transition-all duration-300 group cursor-pointer h-full flex flex-col"
    >
      <div className="aspect-square bg-gradient-to-br from-primary-soft to-secondary-soft relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-warm-gradient opacity-0 group-hover:opacity-20 transition-opacity"></div>
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
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
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
                  onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="space-y-1">
          <h3 className="font-semibold text-base mb-1">{product.name}</h3>
          <p className="text-muted-foreground text-xs">{product.category}</p>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary-soft/30 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-2">
          {Array(Math.floor(product.rating)).fill(0).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{product.rating.toFixed(1)}</span>
        </div>
        <div className="text-accent font-bold mt-2">₹{product.price.toLocaleString("en-IN")}</div>
        <div className="mt-auto pt-2 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); onQuickView(product); }}>
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for events filtering
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [selectedMode, setSelectedMode] = useState([]);

  // State for modals
  const [isArtisanDialogOpen, setIsArtisanDialogOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const eventsRef = useRef(null);

  const renderStars = (rating: number) => {
    return Array(rating).fill(0).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
    ));
  };

  const handleJoinCommunity = () => {
    navigate('/auth');
    toast({
      title: "Please sign in first!",
      description: "You need to sign in to join our vibrant community.",
    });
  };

  const handleViewEvents = () => {
    if (eventsRef.current) {
      eventsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewArtisanWork = (artisan) => {
    setSelectedArtisan(artisan);
    setIsArtisanDialogOpen(true);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };
  
  const handleAddToCart = (product) => {
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const handleCopyPost = (content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content Copied! 🎉",
      description: "The social post has been copied to your clipboard.",
    });
  };

  const handleSharePost = (postTitle: string) => {
    toast({
      title: "Post Shared! 🚀",
      description: `You have successfully shared the "${postTitle}" post.`,
    });
  };

  const handleScrollToTop = useCallback(() => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollToTop);
    return () => window.removeEventListener('scroll', handleScrollToTop);
  }, [handleScrollToTop]);

  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    if (selectedDate) {
      events = events.filter(event => event.date === format(selectedDate, 'yyyy-MM-dd'));
    }

    if (selectedTime) {
      events = events.filter(event => event.time === selectedTime);
    }

    if (selectedMode.length > 0) {
      events = events.filter(event => selectedMode.includes(event.mode));
    }

    // Sorting logic
    switch (sortBy) {
      case 'date':
      default:
        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'time':
        events.sort((a, b) => {
            const timeA = a.time.toUpperCase().includes('PM') ? parseInt(a.time.replace(' PM', '')) + 12 : parseInt(a.time.replace(' AM', ''));
            const timeB = b.time.toUpperCase().includes('PM') ? parseInt(b.time.replace(' PM', '')) + 12 : parseInt(b.time.replace(' AM', ''));
            return timeA - timeB;
        });
        break;
      case 'attendees':
        events.sort((a, b) => b.attendees - a.attendees);
        break;
    }

    return events;
  }, [selectedDate, selectedTime, selectedMode, sortBy]);

  const handleModeChange = (mode: string) => {
    setSelectedMode(prev =>
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleClearFilters = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedMode([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll to Top Button */}
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

      {/* Hero Section */}
      <section className="bg-earth-gradient py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent-soft text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Join Our Vibrant Indian Artisan Community
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Where Artisans
            <span className="bg-warm-gradient bg-clip-text text-transparent"> Connect</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Share your craft, learn from masters, and be part of a vibrant community that celebrates India's authentic artistry and meaningful connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-craft" onClick={handleJoinCommunity}>
              <Users className="w-5 h-5 mr-2" />
              Join Community
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/20 hover:bg-primary-soft"
              onClick={handleViewEvents}
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Events
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <Card key={index} className="text-center shadow-gentle hover:shadow-craft transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-soft rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="py-16 px-4 bg-gradient-to-br from-background via-primary-soft/5 to-secondary-soft/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Artisans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the talented craftspeople who inspire our community with their dedication to traditional techniques and innovative creativity.
            </p>
          </div>
          <div className="flex space-x-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
            {featuredArtisans.map((artisan, index) => (
              <Card
                key={index}
                onClick={() => handleViewArtisanWork(artisan)}
                className="group flex-none w-80 cursor-pointer snap-center shadow-gentle hover:shadow-craft transition-shadow duration-300"
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <img src={artisan.imageUrl} alt={artisan.name} className="w-16 h-16 rounded-full object-cover mb-2" />
                  <h3 className="font-semibold text-lg text-card-foreground">{artisan.name}</h3>
                  <p className="text-sm text-muted-foreground">{artisan.specialty}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {artisan.location}
                  </p>
                  <Button variant="link" className="mt-2 text-primary">
                    View their work
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" ref={eventsRef} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join workshops, meetups, and community gatherings to learn, share, and grow together.
            </p>
          </div>
          {/* Events Filter UI */}
          <Card className="mb-8 p-6 shadow-gentle">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label className="font-semibold mb-2 block">Sort By</Label>
                <Select onValueChange={setSortBy} value={sortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="attendees">Number of Attendees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-semibold mb-2 block">Filter by Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="font-semibold mb-2 block">Filter by Mode</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="online"
                      checked={selectedMode.includes('online')}
                      onCheckedChange={() => handleModeChange('online')}
                    />
                    <Label htmlFor="online">Online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offline"
                      checked={selectedMode.includes('offline')}
                      onCheckedChange={() => handleModeChange('offline')}
                    />
                    <Label htmlFor="offline">Offline</Label>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <Button onClick={handleClearFilters} variant="outline" className="w-full">Clear Filters</Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="shadow-gentle hover:shadow-craft transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.date}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        Hosted by {event.host}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => window.open(`/event/${event.title.toLowerCase().replace(/\s/g, '-')}`, '_blank')}
                      >
                        Join Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No events match your selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Quick View Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-col md:flex-row items-start gap-4">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full md:w-1/2 rounded-md object-cover" />
              <div className="flex-1 space-y-4 pt-4 md:pt-0">
                <DialogTitle className="text-3xl font-bold">{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-1">
                    {Array(Math.floor(selectedProduct.rating)).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-2xl font-bold text-accent mt-2">₹{selectedProduct.price.toLocaleString("en-IN")}</p>
                </DialogDescription>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-primary-soft/30">{tag}</Badge>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <Button onClick={() => { handleAddToCart(selectedProduct); setIsProductDialogOpen(false); }} className="w-full">Add to Cart</Button>
                  <Button variant="outline" className="w-full mt-2">Contact Artisan</Button>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Artisan Dialog */}
      <Dialog open={isArtisanDialogOpen} onOpenChange={setIsArtisanDialogOpen}>
        {selectedArtisan && (
          <DialogContent className="sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-col md:flex-row items-center gap-4 border-b pb-4">
              <img src={selectedArtisan.imageUrl} alt={selectedArtisan.name} className="w-20 h-20 rounded-full object-cover" />
              <div className="text-center md:text-left">
                <DialogTitle className="text-3xl font-bold flex items-center gap-2">
                  <span>{selectedArtisan.name}'s Gallery</span>
                </DialogTitle>
                <DialogDescription className="text-sm">
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {selectedArtisan.location}
                  </p>
                  <p className="text-foreground/80 mt-2">{selectedArtisan.bio}</p>
                  <Button variant="link" asChild className="p-0 h-auto text-sm mt-2">
                    <Link to={`/artisan/${selectedArtisan.name.toLowerCase().replace(' ', '-')}`}>
                      Visit Full Profile
                    </Link>
                  </Button>
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="py-4">
              <h3 className="text-xl font-semibold mb-4 text-primary">Artisan's Creations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.filter(p => p.artisan === selectedArtisan.name).length > 0 ? (
                  allProducts.filter(p => p.artisan === selectedArtisan.name).map(product => (
                    <ProductCard
                      key={product.name}
                      product={product}
                      onQuickView={handleQuickView}
                      onAddToCart={handleAddToCart}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center text-center py-12">
                    <Info className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No products found for this artisan.</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>


      {/* Community Creations Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Community Creations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and admire beautiful handcrafted products from our talented artisans.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.slice(0, 3).map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Preview Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Share Your Passion Effortlessly
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform the daunting task of marketing into moments of joy with AI-generated social content that celebrates your craft
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {socialPosts.map((post, index) => (
              <Card key={index} className="p-6 shadow-gentle hover:shadow-craft transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center">
                      <post.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{post.platform}</h3>
                      <p className="text-xs text-muted-foreground">{post.engagement}</p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                  <div className="text-xs text-primary font-medium">
                    {post.hashtags}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleCopyPost(post.content)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={() => handleSharePost(post.platform)}>
                      Share
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span className="text-xs text-muted-foreground">AI-crafted with love</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-background via-primary-soft/10 to-secondary-soft/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stories from Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every piece finds its home with someone who appreciates the artistry, heritage, and soul woven into each creation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="shadow-gentle hover:shadow-craft transition-all duration-300 bg-card/80 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Quote className="w-8 h-8 text-primary/30" />
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <blockquote className="text-card-foreground leading-relaxed">
                    "{testimonial.message}"
                  </blockquote>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary font-medium">{testimonial.product}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-warm-gradient text-white shadow-craft">
            <CardContent className="p-12">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-white/90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect with fellow artisans, share your craft's story, and be part of a global movement celebrating authentic craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg" onClick={handleJoinCommunity}>
                  <Users className="w-5 h-5 mr-2" />
                  Join Now
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-primary hover:bg-white/10" onClick={() => navigate('/dashboard')}>
                  <Camera className="w-5 h-5 mr-2" />
                  Share Your Work
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Community;
