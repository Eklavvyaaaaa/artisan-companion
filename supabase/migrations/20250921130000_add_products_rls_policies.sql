 
-- Enable RLS for the products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON public.products;

-- Create a policy to allow authenticated users to insert products
CREATE POLICY "Allow authenticated users to insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (true);
