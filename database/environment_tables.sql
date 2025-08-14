-- Environment-based Level Unlock System
-- This script creates the development and production tables for controlling level access

-- Development table
-- Controls level unlock status in development environment
CREATE TABLE IF NOT EXISTS public.development (
  id SERIAL PRIMARY KEY,
  training BOOLEAN NOT NULL DEFAULT FALSE,
  hl_1 BOOLEAN NOT NULL DEFAULT TRUE,
  hl_2 BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Production table  
-- Controls level unlock status in production environment
CREATE TABLE IF NOT EXISTS public.production (
  id SERIAL PRIMARY KEY,
  training BOOLEAN NOT NULL DEFAULT FALSE,
  hl_1 BOOLEAN NOT NULL DEFAULT FALSE,
  hl_2 BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default configuration for development
-- TRUE = unlocked, FALSE = locked
-- Development: training=locked, hl_1=unlocked, hl_2=locked
INSERT INTO public.development (training, hl_1, hl_2)
VALUES (FALSE, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Insert default configuration for production
-- TRUE = unlocked, FALSE = locked
-- Production: training=locked, hl_1=locked, hl_2=locked
INSERT INTO public.production (training, hl_1, hl_2)
VALUES (FALSE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE public.development ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access for authenticated users
CREATE POLICY "Allow read access for authenticated users" ON public.development
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON public.production
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies to allow admin users to update (optional - for future admin panel)
-- You can modify this to match your admin user identification logic
CREATE POLICY "Allow admin updates" ON public.development
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@rareminds.in'
    )
  );

CREATE POLICY "Allow admin updates" ON public.production
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@rareminds.in'
    )
  );

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_development_updated_at 
  BEFORE UPDATE ON public.development 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_updated_at 
  BEFORE UPDATE ON public.production 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.development IS 'Controls level unlock status in development environment. Logic: TRUE = unlocked, FALSE = locked';
COMMENT ON TABLE public.production IS 'Controls level unlock status in production environment. Logic: TRUE = unlocked, FALSE = locked';
COMMENT ON COLUMN public.development.training IS 'Controls access to training levels (IDs 1-15). TRUE = unlocked, FALSE = locked';
COMMENT ON COLUMN public.development.hl_1 IS 'Controls access to HL_1 level (ID 16). TRUE = unlocked, FALSE = locked';
COMMENT ON COLUMN public.development.hl_2 IS 'Controls access to HL_2 level (ID 17). TRUE = unlocked, FALSE = locked';
COMMENT ON COLUMN public.production.training IS 'Controls access to training levels (IDs 1-15). TRUE = unlocked, FALSE = locked';
COMMENT ON COLUMN public.production.hl_1 IS 'Controls access to HL_1 level (ID 16). TRUE = unlocked, FALSE = locked';
COMMENT ON COLUMN public.production.hl_2 IS 'Controls access to HL_2 level (ID 17). TRUE = unlocked, FALSE = locked';
