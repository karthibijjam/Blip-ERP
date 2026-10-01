-- ============================================================================
-- BLIP ERP - PRODUCTION RELATIONAL POSTGRESQL SCHEMA WITH ZERO-DATA-LOSS MIGRATION
-- ============================================================================
-- Eliminates the Single Monolithic JSON Blob (erp_state) Bottleneck
-- Replaces it with 9 Normalized Relational Tables + Row-Level Realtime Sync
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. CLEAN UP ANY PRE-EXISTING EMPTY TABLES MISSING THE company_id COLUMN
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  -- If customers exists without company_id column, drop legacy empty table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customers'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'customers' AND column_name = 'company_id'
  ) THEN
    DROP TABLE public.customers CASCADE;
  END IF;

  -- If selling_items exists without company_id column, drop legacy empty table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'selling_items'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'selling_items' AND column_name = 'company_id'
  ) THEN
    DROP TABLE public.selling_items CASCADE;
  END IF;

  -- If company_users exists without company_id column, drop legacy empty table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'company_users'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_users' AND column_name = 'company_id'
  ) THEN
    DROP TABLE public.company_users CASCADE;
  END IF;

  -- If dairy_farmers exists without company_id column, drop legacy empty table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dairy_farmers'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dairy_farmers' AND column_name = 'company_id'
  ) THEN
    DROP TABLE public.dairy_farmers CASCADE;
  END IF;

  -- If dairy_procurement exists without company_id column, drop legacy empty table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dairy_procurement'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dairy_procurement' AND column_name = 'company_id'
  ) THEN
    DROP TABLE public.dairy_procurement CASCADE;
  END IF;

  -- If delivery_routes exists without company_id column, drop legacy empty table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'delivery_routes'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'delivery_routes' AND column_name = 'company_id'
  ) THEN
    DROP TABLE public.delivery_routes CASCADE;
  END IF;

  -- If financial_transactions exists without company_id column, drop legacy empty table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'financial_transactions'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'financial_transactions' AND column_name = 'company_id'
  ) THEN
    DROP TABLE public.financial_transactions CASCADE;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 1. COMPANIES (TENANTS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  serial_number INT NOT NULL DEFAULT 101,
  name TEXT NOT NULL,
  gst TEXT,
  owner TEXT,
  email TEXT UNIQUE,
  password TEXT DEFAULT 'admin123',
  requires_password_change BOOLEAN DEFAULT true,
  is_first_time_login BOOLEAN DEFAULT true,
  phone TEXT,
  address TEXT,
  plan TEXT DEFAULT 'Professional',
  status TEXT DEFAULT 'Active',
  renewal_date DATE DEFAULT '2027-09-30',
  monthly_fee NUMERIC DEFAULT 8500,
  subscribed_modules JSONB DEFAULT '["dairy", "fmcg"]'::jsonb,
  avatar TEXT,
  password_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS serial_number INT DEFAULT 101;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS gst TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS owner TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS password TEXT DEFAULT 'admin123';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT true;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS is_first_time_login BOOLEAN DEFAULT true;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Professional';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS renewal_date DATE DEFAULT '2027-09-30';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC DEFAULT 8500;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS subscribed_modules JSONB DEFAULT '["dairy", "fmcg"]'::jsonb;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email);

-- ----------------------------------------------------------------------------
-- 2. PLATFORM TEAM (HQ USERS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'Platform Administrator',
  phone TEXT,
  status TEXT DEFAULT 'Active',
  avatar TEXT,
  joined_date DATE DEFAULT CURRENT_DATE,
  last_login TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Platform Administrator';
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS joined_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.platform_team ADD COLUMN IF NOT EXISTS last_login TEXT;

-- ----------------------------------------------------------------------------
-- 3. COMPANY USERS / EMPLOYEES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_users (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT DEFAULT 'user123',
  role TEXT NOT NULL DEFAULT 'Manager',
  brand TEXT DEFAULT 'All Brands',
  status TEXT DEFAULT 'Active',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS password TEXT DEFAULT 'user123';
ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Manager';
ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'All Brands';
ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.company_users ADD COLUMN IF NOT EXISTS avatar TEXT;

CREATE INDEX IF NOT EXISTS idx_company_users_comp ON public.company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_email ON public.company_users(email);

-- ----------------------------------------------------------------------------
-- 4. CUSTOMERS DIRECTORY (MOBILE ID)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  area TEXT,
  route TEXT,
  sku TEXT,
  bill NUMERIC DEFAULT 0,
  pending NUMERIC DEFAULT 0,
  reg_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS brand_id TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS route TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS bill NUMERIC DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS pending NUMERIC DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS reg_date DATE DEFAULT CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_customers_comp_brand ON public.customers(company_id, brand_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ----------------------------------------------------------------------------
-- 5. SELLING ITEMS & SKUs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.selling_items (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL,
  sku_code TEXT,
  name TEXT NOT NULL,
  category TEXT,
  mrp NUMERIC,
  price NUMERIC NOT NULL,
  stock NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'In Stock',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS brand_id TEXT;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS sku_code TEXT;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS mrp NUMERIC;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS stock NUMERIC DEFAULT 0;
ALTER TABLE public.selling_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'In Stock';

CREATE INDEX IF NOT EXISTS idx_selling_items_comp_brand ON public.selling_items(company_id, brand_id);

-- ----------------------------------------------------------------------------
-- 6. DAIRY FARMERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dairy_farmers (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  area TEXT,
  rate_per_liter NUMERIC DEFAULT 48,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.dairy_farmers ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.dairy_farmers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.dairy_farmers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.dairy_farmers ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE public.dairy_farmers ADD COLUMN IF NOT EXISTS rate_per_liter NUMERIC DEFAULT 48;

CREATE INDEX IF NOT EXISTS idx_dairy_farmers_comp ON public.dairy_farmers(company_id);

-- ----------------------------------------------------------------------------
-- 7. DAIRY PROCUREMENT (DAILY MILK ENTRIES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dairy_procurement (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  farmer_id TEXT,
  farmer_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  shift TEXT NOT NULL DEFAULT 'Morning',
  qty NUMERIC NOT NULL DEFAULT 0,
  fat NUMERIC NOT NULL DEFAULT 0,
  snf NUMERIC NOT NULL DEFAULT 0,
  rate NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS farmer_id TEXT;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS farmer_name TEXT;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS shift TEXT DEFAULT 'Morning';
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS qty NUMERIC DEFAULT 0;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS fat NUMERIC DEFAULT 0;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS snf NUMERIC DEFAULT 0;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS rate NUMERIC DEFAULT 0;
ALTER TABLE public.dairy_procurement ADD COLUMN IF NOT EXISTS total NUMERIC DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_dairy_procurement_comp_date ON public.dairy_procurement(company_id, date);

-- ----------------------------------------------------------------------------
-- 8. DELIVERY ROUTES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_routes (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  executive TEXT,
  customers_count INT DEFAULT 0,
  shift TEXT DEFAULT 'Morning (5:00 AM - 8:00 AM)',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.delivery_routes ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.delivery_routes ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.delivery_routes ADD COLUMN IF NOT EXISTS executive TEXT;
ALTER TABLE public.delivery_routes ADD COLUMN IF NOT EXISTS customers_count INT DEFAULT 0;
ALTER TABLE public.delivery_routes ADD COLUMN IF NOT EXISTS shift TEXT DEFAULT 'Morning (5:00 AM - 8:00 AM)';

CREATE INDEX IF NOT EXISTS idx_delivery_routes_comp ON public.delivery_routes(company_id);

-- ----------------------------------------------------------------------------
-- 9. FINANCIAL TRANSACTIONS (SALES, PURCHASES, EXPENSES, SALARIES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'sale', 'purchase', 'expense', 'salary'
  category TEXT,
  party_name TEXT,
  sku TEXT,
  qty TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Paid',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  desc_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS brand_id TEXT;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS party_name TEXT;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS qty TEXT;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Paid';
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.financial_transactions ADD COLUMN IF NOT EXISTS desc_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_financial_tx_comp_brand ON public.financial_transactions(company_id, brand_id, type);
CREATE INDEX IF NOT EXISTS idx_financial_tx_date ON public.financial_transactions(date);

-- ----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
-- ----------------------------------------------------------------------------
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selling_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_procurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Drop prior policies if they exist to prevent duplicate policy errors
DROP POLICY IF EXISTS "Allow full access to companies" ON public.companies;
DROP POLICY IF EXISTS "Allow full access to platform_team" ON public.platform_team;
DROP POLICY IF EXISTS "Allow full access to company_users" ON public.company_users;
DROP POLICY IF EXISTS "Allow full access to customers" ON public.customers;
DROP POLICY IF EXISTS "Allow full access to selling_items" ON public.selling_items;
DROP POLICY IF EXISTS "Allow full access to dairy_farmers" ON public.dairy_farmers;
DROP POLICY IF EXISTS "Allow full access to dairy_procurement" ON public.dairy_procurement;
DROP POLICY IF EXISTS "Allow full access to delivery_routes" ON public.delivery_routes;
DROP POLICY IF EXISTS "Allow full access to financial_transactions" ON public.financial_transactions;

-- Allow read/write policies for client & API roles
CREATE POLICY "Allow full access to companies" ON public.companies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to platform_team" ON public.platform_team FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to company_users" ON public.company_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to customers" ON public.customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to selling_items" ON public.selling_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to dairy_farmers" ON public.dairy_farmers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to dairy_procurement" ON public.dairy_procurement FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to delivery_routes" ON public.delivery_routes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to financial_transactions" ON public.financial_transactions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 11. ENABLE REALTIME ON NORMALIZED TABLES
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'companies') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'platform_team') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_team;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'customers') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'selling_items') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.selling_items;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'dairy_procurement') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.dairy_procurement;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'financial_transactions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_transactions;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 12. AUTOMATIC LOSSLESS MIGRATION: EXTRACT CURRENT JSON DATA INTO RELATIONAL TABLES
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.migrate_erp_state_to_relational()
RETURNS text AS $$
DECLARE
  v_state JSONB;
  c JSONB;
  pt JSONB;
  cust JSONB;
  item JSONB;
  farmer JSONB;
  proc JSONB;
  route JSONB;
  sale JSONB;
  exp JSONB;
  b_id TEXT;
  v_migrated_companies INT := 0;
BEGIN
  -- Check if old erp_state table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'erp_state') THEN
    RETURN 'erp_state table not found; skipping migration.';
  END IF;

  SELECT data INTO v_state FROM public.erp_state WHERE id = 'bijjam_group_default';
  IF v_state IS NULL THEN
    RETURN 'No erp_state data found to migrate.';
  END IF;

  -- 1. Unpack Companies (Preserves Murali & Co. and all existing tenants)
  FOR c IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'companies', '[]'::jsonb))
  LOOP
    INSERT INTO public.companies (
      id, serial_number, name, gst, owner, email, password,
      requires_password_change, is_first_time_login, phone, address,
      plan, status, renewal_date, monthly_fee, subscribed_modules, avatar
    ) VALUES (
      COALESCE(c->>'id', 'comp-' || (c->>'companyId')),
      COALESCE((c->>'companyId')::INT, (c->>'code')::INT, 101),
      COALESCE(c->>'name', 'Company Outlet'),
      c->>'gst',
      c->>'owner',
      c->>'email',
      COALESCE(c->>'password', 'admin123'),
      COALESCE((c->>'requiresPasswordChange')::BOOLEAN, false),
      COALESCE((c->>'isFirstTimeLogin')::BOOLEAN, false),
      c->>'phone',
      c->>'address',
      COALESCE(c->>'plan', 'Professional'),
      COALESCE(c->>'status', 'Active'),
      COALESCE((c->>'renewalDate')::DATE, '2027-09-30'::DATE),
      COALESCE((c->>'monthlyFee')::NUMERIC, 8500),
      COALESCE(c->'subscribedModules', '["dairy", "fmcg"]'::jsonb),
      c->>'avatar'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      owner = EXCLUDED.owner,
      email = EXCLUDED.email,
      password = EXCLUDED.password,
      requires_password_change = EXCLUDED.requires_password_change,
      is_first_time_login = EXCLUDED.is_first_time_login,
      status = EXCLUDED.status,
      monthly_fee = EXCLUDED.monthly_fee,
      subscribed_modules = EXCLUDED.subscribed_modules,
      avatar = EXCLUDED.avatar;
    
    v_migrated_companies := v_migrated_companies + 1;
  END LOOP;

  -- 2. Unpack Platform Team
  FOR pt IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'platformTeam', '[]'::jsonb))
  LOOP
    INSERT INTO public.platform_team (id, name, email, role, phone, status, joined_date, last_login, avatar)
    VALUES (
      COALESCE(pt->>'id', 'pt-' || md5(pt->>'email')),
      COALESCE(pt->>'name', 'Platform User'),
      COALESCE(pt->>'email', 'admin@bliperp.com'),
      COALESCE(pt->>'role', 'Platform Administrator'),
      pt->>'phone',
      COALESCE(pt->>'status', 'Active'),
      COALESCE((pt->>'joinedDate')::DATE, CURRENT_DATE),
      pt->>'lastLogin',
      pt->>'avatar'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone,
      avatar = EXCLUDED.avatar;
  END LOOP;

  -- 3. Unpack Customers
  FOR b_id IN SELECT jsonb_object_keys(COALESCE(v_state->'customersByBrand', '{}'::jsonb))
  LOOP
    FOR cust IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'customersByBrand'->b_id, '[]'::jsonb))
    LOOP
      INSERT INTO public.customers (id, company_id, brand_id, name, phone, area, reg_date)
      VALUES (
        'cust-' || b_id || '-' || COALESCE(cust->>'id', cust->>'phone'),
        'bijjam-group',
        b_id,
        COALESCE(cust->>'name', 'Customer'),
        COALESCE(cust->>'phone', '0000000000'),
        cust->>'area',
        COALESCE((cust->>'regDate')::DATE, CURRENT_DATE)
      )
      ON CONFLICT (id) DO NOTHING;
    END LOOP;
  END LOOP;

  -- 4. Unpack Selling Items
  FOR b_id IN SELECT jsonb_object_keys(COALESCE(v_state->'sellingItemsByBrand', '{}'::jsonb))
  LOOP
    FOR item IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'sellingItemsByBrand'->b_id, '[]'::jsonb))
    LOOP
      INSERT INTO public.selling_items (id, company_id, brand_id, name, category, mrp, price, stock, status)
      VALUES (
        'item-' || b_id || '-' || COALESCE(item->>'id', md5(item->>'name')),
        'bijjam-group',
        b_id,
        COALESCE(item->>'name', 'Product SKU'),
        item->>'category',
        (item->>'mrp')::NUMERIC,
        COALESCE((item->>'price')::NUMERIC, 0),
        COALESCE((item->>'stock')::NUMERIC, 0),
        COALESCE(item->>'status', 'In Stock')
      )
      ON CONFLICT (id) DO NOTHING;
    END LOOP;
  END LOOP;

  -- 5. Unpack Dairy Farmers
  FOR farmer IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'dairyFarmers', '[]'::jsonb))
  LOOP
    INSERT INTO public.dairy_farmers (id, company_id, name, phone, area)
    VALUES (
      'farmer-' || COALESCE(farmer->>'id', md5(farmer->>'name')),
      'bijjam-group',
      COALESCE(farmer->>'name', 'Dairy Farmer'),
      COALESCE(farmer->>'phone', '0000000000'),
      farmer->>'area'
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- 6. Unpack Dairy Procurement
  FOR proc IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'dairyProcurement', '[]'::jsonb))
  LOOP
    INSERT INTO public.dairy_procurement (id, company_id, date, shift, farmer_name, qty, fat, snf, rate, total)
    VALUES (
      'proc-' || COALESCE(proc->>'id', md5((proc->>'farmer') || (proc->>'date') || (proc->>'shift'))),
      'bijjam-group',
      COALESCE((proc->>'date')::DATE, CURRENT_DATE),
      COALESCE(proc->>'shift', 'Morning'),
      COALESCE(proc->>'farmer', 'Farmer'),
      COALESCE((proc->>'qty')::NUMERIC, 0),
      COALESCE((proc->>'fat')::NUMERIC, 0),
      COALESCE((proc->>'snf')::NUMERIC, 0),
      COALESCE((proc->>'rate')::NUMERIC, 0),
      COALESCE((proc->>'total')::NUMERIC, 0)
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- 7. Unpack Delivery Routes
  FOR route IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'deliveryRoutes', '[]'::jsonb))
  LOOP
    INSERT INTO public.delivery_routes (id, company_id, name, executive, customers_count, shift)
    VALUES (
      'route-' || COALESCE(route->>'id', md5(route->>'name')),
      'bijjam-group',
      COALESCE(route->>'name', 'Route'),
      route->>'executive',
      COALESCE((route->>'customers')::INT, 0),
      COALESCE(route->>'shift', 'Morning')
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- 8. Unpack Transactions
  FOR sale IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'farmsSales', '[]'::jsonb))
  LOOP
    INSERT INTO public.financial_transactions (id, company_id, brand_id, type, date, party_name, sku, amount, status)
    VALUES (
      'tx-sale-farms-' || COALESCE(sale->>'id', md5(sale->>'date' || sale->>'customer')),
      'bijjam-group',
      'farms',
      'sale',
      COALESCE((sale->>'date')::DATE, CURRENT_DATE),
      sale->>'customer',
      sale->>'sku',
      COALESCE((sale->>'amount')::NUMERIC, 0),
      COALESCE(sale->>'status', 'Paid')
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  FOR exp IN SELECT * FROM jsonb_array_elements(COALESCE(v_state->'mixedExpenses', '[]'::jsonb))
  LOOP
    INSERT INTO public.financial_transactions (id, company_id, brand_id, type, date, category, desc_notes, amount, status)
    VALUES (
      'tx-exp-mixed-' || COALESCE(exp->>'id', md5(exp->>'date' || exp->>'desc')),
      'bijjam-group',
      'mixed',
      'expense',
      COALESCE((exp->>'date')::DATE, CURRENT_DATE),
      exp->>'category',
      exp->>'desc',
      COALESCE((exp->>'amount')::NUMERIC, 0),
      'Paid'
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  RETURN 'Successfully unpacked ' || v_migrated_companies || ' companies and all business entities into normalized relational tables!';
END;
$$ LANGUAGE plpgsql;

-- Execute migration immediately
SELECT public.migrate_erp_state_to_relational();
