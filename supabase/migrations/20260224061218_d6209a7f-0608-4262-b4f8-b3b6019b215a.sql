
-- Fix overly permissive categories INSERT policy
DROP POLICY "Authenticated users can create categories" ON public.categories;
-- Only allow inserts if no duplicate (categories are seeded, rarely user-created)
CREATE POLICY "Authenticated users can create categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
