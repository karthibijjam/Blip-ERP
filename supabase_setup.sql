-- ============================================================================
-- BIJJAM ENTERPRISES ERP - COMPLETE FINAL SUPABASE DATABASE SETUP
-- ============================================================================
-- Instructions:
-- 1. Open your Supabase Project: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" from the left sidebar
-- 3. Click "New Query", paste this entire script, and click "Run" (Cmd+Enter / Ctrl+Enter)
-- 4. Result: Tables created, RLS policies enabled, Realtime activated, and default data seeded!
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CREATE CORE ERP STATE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.erp_state (
  id TEXT PRIMARY KEY DEFAULT 'bijjam_group_default',
  company_name TEXT DEFAULT 'Bijjam Enterprises Group',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure full replica identity for instant, complete Realtime delta sync
ALTER TABLE public.erp_state REPLICA IDENTITY FULL;

-- ----------------------------------------------------------------------------
-- 2. AUTOMATIC UPDATED_AT TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_erp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_erp_state_updated_at ON public.erp_state;
CREATE TRIGGER trigger_erp_state_updated_at
  BEFORE UPDATE ON public.erp_state
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_erp_updated_at();

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE public.erp_state ENABLE ROW LEVEL SECURITY;

-- Clean up any prior conflicting policies
DROP POLICY IF EXISTS "Allow public select on erp_state" ON public.erp_state;
DROP POLICY IF EXISTS "Allow public insert on erp_state" ON public.erp_state;
DROP POLICY IF EXISTS "Allow public update on erp_state" ON public.erp_state;
DROP POLICY IF EXISTS "Allow public delete on erp_state" ON public.erp_state;
DROP POLICY IF EXISTS "Allow all access on erp_state" ON public.erp_state;
DROP POLICY IF EXISTS "Allow public access to erp_state" ON public.erp_state;

-- Single comprehensive policy permitting full read/write for anon and authenticated clients
CREATE POLICY "Allow public access to erp_state" ON public.erp_state
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Explicitly grant permissions to API roles so queries never get 403 Forbidden
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.erp_state TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 4. REALTIME REPLICATION SETUP (SAFE & IDEMPOTENT)
-- ----------------------------------------------------------------------------
-- Adds erp_state to the supabase_realtime publication without failing on re-runs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'erp_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.erp_state;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 5. SEED INITIAL ERP DEFAULT STATE (INSTANT FIRST RUN READY)
-- ----------------------------------------------------------------------------
INSERT INTO public.erp_state (id, company_name, data, updated_at)
VALUES (
  'bijjam_group_default',
  'Bijjam Enterprises Group',
  '{
    "company": {
      "name": "Bijjam Enterprises Group",
      "gst": "36AABCB1234F1Z5",
      "phone": "+91 9848012345",
      "address": "Plot No. 42, Dairy Farm Road, Jubilee Hills, Hyderabad"
    },
    "companies": [
      {
        "id": "bijjam-group",
        "name": "Bijjam Enterprises Group",
        "gst": "36AABCB1234F1Z5",
        "owner": "Bijjam Enterprises Admin",
        "email": "admin@bijjamenterprises.com",
        "password": "admin123",
        "phone": "+91 9848012345",
        "address": "Plot No. 42, Dairy Farm Road, Jubilee Hills, Hyderabad",
        "plan": "Enterprise",
        "status": "Active",
        "renewalDate": "2027-09-30",
        "monthlyFee": 15000,
        "subscribedModules": ["dairy", "fmcg", "mixed"],
        "createdDate": "2026-01-15"
      },
      {
        "id": "sri-krishna-dairy",
        "name": "Sri Krishna Dairy Farms Pvt Ltd",
        "gst": "36AAACK9876E1Z2",
        "owner": "Krishna Murthy",
        "email": "krishna@skdairy.com",
        "password": "admin123",
        "phone": "+91 9848099887",
        "address": "NH 44, Medchal Highway, Hyderabad",
        "plan": "Professional",
        "status": "Active",
        "renewalDate": "2026-12-15",
        "monthlyFee": 6500,
        "subscribedModules": ["dairy"],
        "createdDate": "2026-03-10"
      },
      {
        "id": "green-agro-fmcg",
        "name": "Green Agro Naturals & FMCG",
        "gst": "36AABCG5544K1Z8",
        "owner": "Haritha Reddy",
        "email": "haritha@greenagro.com",
        "password": "admin123",
        "phone": "+91 9848077665",
        "address": "Industrial Area, Cherlapally, Hyderabad",
        "plan": "Starter",
        "status": "Active",
        "renewalDate": "2026-11-01",
        "monthlyFee": 4500,
        "subscribedModules": ["fmcg"],
        "createdDate": "2026-05-20"
      }
    ],
    "admin": {
      "name": "Bijjam Enterprises Admin",
      "email": "admin@bijjamenterprises.com",
      "phone": "+91 9848012345",
      "password": "admin123"
    },
    "users": [
      { "id": 1, "name": "Rajesh Sharma", "email": "rajesh@bijjam.com", "password": "user123", "role": "Manager", "brand": "All Brands", "companyId": "bijjam-group", "status": "Active" },
      { "id": 2, "name": "Suresh Kumar", "email": "suresh@bijjam.com", "password": "user123", "role": "Accountant", "brand": "Bijjam Dairy", "companyId": "bijjam-group", "status": "Active" },
      { "id": 3, "name": "Venkatesh Rao", "email": "venkat@skdairy.com", "password": "user123", "role": "Plant Supervisor", "brand": "Bijjam Dairy", "companyId": "sri-krishna-dairy", "status": "Active" },
      { "id": 4, "name": "Pooja Nair", "email": "pooja@greenagro.com", "password": "user123", "role": "Sales Lead", "brand": "Bijjam Farms", "companyId": "green-agro-fmcg", "status": "Active" }
    ],
    "platformTeam": [
      { "id": "pt-1", "name": "Karthik Reddy", "email": "karthik@bliperp.com", "role": "Platform Director & Founder", "phone": "+91 9848012345", "status": "Active", "joinedDate": "2026-01-01", "lastLogin": "Today, 05:00 PM" },
      { "id": "pt-2", "name": "Blip Admin", "email": "admin@bliperp.com", "role": "Lead Platform Administrator", "phone": "+91 9000011223", "status": "Active", "joinedDate": "2026-01-15", "lastLogin": "Today, 04:45 PM" },
      { "id": "pt-3", "name": "Priya Sharma", "email": "priya@bliperp.com", "role": "Platform Operations Manager", "phone": "+91 9848055443", "status": "Active", "joinedDate": "2026-02-10", "lastLogin": "Yesterday" },
      { "id": "pt-4", "name": "Rahul Verma", "email": "rahul@bliperp.com", "role": "Cloud Infrastructure & DevOps Lead", "phone": "+91 9848077665", "status": "Active", "joinedDate": "2026-03-01", "lastLogin": "3 days ago" },
      { "id": "pt-5", "name": "Master Admin", "email": "superadmin@bliperp.com", "role": "Super Platform Administrator", "phone": "+91 9000099887", "status": "Active", "joinedDate": "2026-01-01", "lastLogin": "Today" }
    ],
    "brands": [
      { "id": "dairy", "name": "Bijjam Dairy", "icon": "fa-solid fa-cow", "color": "amber", "subtitle": "Farmer Milk Procurement & Delivery", "active": true },
      { "id": "farms", "name": "Bijjam Farms", "icon": "fa-solid fa-seedling", "color": "emerald", "subtitle": "Bulk Food Products & Retail", "active": true },
      { "id": "plantrix", "name": "Eco Plantrix", "icon": "fa-solid fa-spray-can-sparkles", "color": "cyan", "subtitle": "Eco-Friendly Cleaning Products", "active": true },
      { "id": "mixed", "name": "Mixed Spends", "icon": "fa-solid fa-wallet", "color": "purple", "subtitle": "Common Company Overheads & Salaries", "active": true }
    ],
    "brandModules": {
      "dairy": [
        { "id": "sales", "name": "Sales Management Hub", "icon": "fa-solid fa-cash-register", "color": "emerald", "desc": "Record milk sales & customer bills" },
        { "id": "delivery", "name": "Milk Delivery Management Hub", "icon": "fa-solid fa-truck-fast", "color": "cyan", "desc": "Manage delivery routes & subscriptions" },
        { "id": "milk_purchases", "name": "Milk Farmers Management Hub", "icon": "fa-solid fa-users", "color": "amber", "desc": "Add & manage milk suppliers & farmers" },
        { "id": "purchases", "name": "Purchases Management Hub", "icon": "fa-solid fa-cart-shopping", "color": "blue", "desc": "Record farmer milk procurement" },
        { "id": "expenses", "name": "Expenses Management Hub", "icon": "fa-solid fa-receipt", "color": "amber", "desc": "Cattle feed & veterinary costs" },
        { "id": "salary", "name": "Salary Management Hub", "icon": "fa-solid fa-wallet", "color": "purple", "desc": "Staff wages & dairy personnel pay" }
      ],
      "farms": [
        { "id": "sales", "name": "Sales Management Hub", "icon": "fa-solid fa-cash-register", "color": "emerald", "desc": "Record and manage retail sales" },
        { "id": "purchases", "name": "Purchases Management Hub", "icon": "fa-solid fa-cart-shopping", "color": "blue", "desc": "Record and manage inventory & supplies" },
        { "id": "expenses", "name": "Expenses Management Hub", "icon": "fa-solid fa-receipt", "color": "amber", "desc": "Record and manage operational costs" },
        { "id": "salary", "name": "Salary Management Hub", "icon": "fa-solid fa-wallet", "color": "purple", "desc": "Record and manage staff wages" }
      ],
      "plantrix": [
        { "id": "sales", "name": "Sales Management Hub", "icon": "fa-solid fa-cash-register", "color": "cyan", "desc": "Record cleaning products sales" },
        { "id": "purchases", "name": "Purchases Management Hub", "icon": "fa-solid fa-cart-shopping", "color": "blue", "desc": "Record raw chemical & jar purchases" },
        { "id": "expenses", "name": "Expenses Management Hub", "icon": "fa-solid fa-receipt", "color": "amber", "desc": "Lab utility & packaging costs" },
        { "id": "salary", "name": "Salary Management Hub", "icon": "fa-solid fa-wallet", "color": "purple", "desc": "Plantrix technician & sales wages" }
      ]
    },
    "dairyFarmers": [
      { "id": 1, "name": "Ramesh Kumar", "phone": "9848012345", "area": "Jubilee Hills" },
      { "id": 2, "name": "Venkat Reddy", "phone": "9848056789", "area": "Banjara Hills" }
    ],
    "deliveryRoutes": [
      { "id": 1, "name": "Route A - Jubilee Hills", "executive": "Rajesh Sharma", "customers": 28, "shift": "Morning (5:00 AM - 8:00 AM)" },
      { "id": 2, "name": "Route B - Banjara Hills", "executive": "Suresh Kumar", "customers": 22, "shift": "Morning (5:00 AM - 8:00 AM)" }
    ],
    "dairyCustomers": [
      { "id": 1, "name": "Dr. Srinivas Rao", "route": "Route A - Jubilee Hills", "phone": "9848012345", "sku": "Cow Milk 1L", "bill": 3250, "recentDate": "2026-09-30", "pending": 500, "payments": [] },
      { "id": 2, "name": "Smt. Anitha Reddy", "route": "Route B - Banjara Hills", "phone": "9848056789", "sku": "Buffalo Milk 0.5L", "bill": 2100, "recentDate": "2026-09-29", "pending": 0, "payments": [] }
    ],
    "dairyProcurement": [
      { "id": 1, "date": "2026-09-30", "shift": "Morning", "farmer": "Ramesh Kumar", "qty": 15.0, "fat": 6.5, "snf": 8.5, "rate": 48, "total": 720 },
      { "id": 2, "date": "2026-09-29", "shift": "Evening", "farmer": "Venkat Reddy", "qty": 20.0, "fat": 6.2, "snf": 8.4, "rate": 47, "total": 940 }
    ],
    "dairyCattleExpenses": [
      { "id": 1, "date": "2026-09-30", "category": "Feed & Fodder", "desc": "Cotton Cake Feed", "amount": 1200 },
      { "id": 2, "date": "2026-09-28", "category": "Feed & Fodder", "desc": "5 Bags Cotton Cake Cattle Feed", "amount": 3500 }
    ],
    "farmsPurchases": [
      { "id": 1, "date": "2026-09-30", "supplier": "Organic Agro", "sku": "Organic Turmeric", "qty": "10 Packets", "amount": 1500 },
      { "id": 2, "date": "2026-09-25", "supplier": "Organic Mill Agro", "sku": "50kg Organic Millet Flour", "qty": "50 Packets", "amount": 4500 }
    ],
    "farmsSales": [
      { "id": 1, "date": "2026-09-30", "customer": "Rahul", "sku": "Honey 500g", "status": "Paid", "amount": 450 },
      { "id": 2, "date": "2026-09-29", "customer": "Sunitha", "sku": "Millet Flour 2kg, Honey 500g", "status": "Paid", "amount": 680 }
    ],
    "plantrixPurchases": [
      { "id": 1, "date": "2026-09-30", "supplier": "ChemCo", "sku": "Disinfectant Base 10L", "qty": "2 Jars", "amount": 1100 },
      { "id": 2, "date": "2026-09-22", "supplier": "GreenChem Lab", "sku": "Herbal Floor Cleaner 5L Jars", "qty": "20 Jars", "amount": 3200 }
    ],
    "plantrixSales": [
      { "id": 1, "date": "2026-09-30", "customer": "Villas Society", "sku": "Floor Cleaner 5L", "status": "Paid", "amount": 950 },
      { "id": 2, "date": "2026-09-29", "customer": "Apex Apartments", "sku": "Dishwash 1L, Floor Cleaner 5L", "status": "Paid", "amount": 1250 }
    ],
    "mixedExpenses": [
      { "id": 1, "date": "2026-09-30", "category": "Utilities", "desc": "Electricity Bill", "amount": 3200 },
      { "id": 2, "date": "2026-09-01", "category": "Salaries & Wages", "desc": "Monthly Staff Salaries", "amount": 45000 },
      { "id": 3, "date": "2026-09-05", "category": "Office Rent", "desc": "Godown & Office Rent", "amount": 25000 }
    ],
    "customersByBrand": {
      "dairy": [
        { "id": 1, "name": "Dr. Srinivas Rao", "phone": "9848012345", "area": "Jubilee Hills", "regDate": "2026-09-01" },
        { "id": 2, "name": "Smt. Anitha Reddy", "phone": "9848056789", "area": "Banjara Hills", "regDate": "2026-09-05" }
      ],
      "farms": [
        { "id": 1, "name": "Rahul", "phone": "9848099881", "area": "Madhapur", "regDate": "2026-09-10" },
        { "id": 2, "name": "Sunitha", "phone": "9848088772", "area": "Kondapur", "regDate": "2026-09-12" }
      ],
      "plantrix": [
        { "id": 1, "name": "Villas Society", "phone": "9848077663", "area": "Gachibowli", "regDate": "2026-09-15" },
        { "id": 2, "name": "Apex Apartments", "phone": "9848066554", "area": "Hitec City", "regDate": "2026-09-18" }
      ],
      "mixed": []
    },
    "sellingItemsByBrand": {
      "dairy": [
        { "id": 1, "name": "Cow Milk 1L Pack", "category": "Dairy", "mrp": 75, "price": 70, "stock": 240, "status": "In Stock" },
        { "id": 2, "name": "Buffalo Milk 1L Pack", "category": "Dairy", "mrp": 85, "price": 80, "stock": 180, "status": "In Stock" },
        { "id": 3, "name": "Pure Desi Ghee 500ml", "category": "Dairy", "mrp": 450, "price": 420, "stock": 65, "status": "In Stock" }
      ],
      "farms": [
        { "id": 1, "name": "Organic Millet Flour 1kg", "category": "Food Products", "mrp": 120, "price": 100, "stock": 150, "status": "In Stock" },
        { "id": 2, "name": "Wild Forest Honey 500g", "category": "Food Products", "mrp": 380, "price": 340, "stock": 85, "status": "In Stock" },
        { "id": 3, "name": "Organic Turmeric Powder 200g", "category": "Food Products", "mrp": 90, "price": 80, "stock": 120, "status": "In Stock" }
      ],
      "plantrix": [
        { "id": 1, "name": "Eco Floor Cleaner 5L Can", "category": "Cleaning", "mrp": 550, "price": 480, "stock": 90, "status": "In Stock" },
        { "id": 2, "name": "Herbal Dishwash Gel 1L", "category": "Cleaning", "mrp": 180, "price": 150, "stock": 140, "status": "In Stock" }
      ],
      "mixed": []
    }
  }'::jsonb,
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. OPTIONAL RELATIONAL TABLES (FOR DIRECT SQL QUERIES & ANALYTICS)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  subtitle TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.customers (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  brand_id TEXT REFERENCES public.brands(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  area TEXT,
  route TEXT,
  registered_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.selling_items (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  brand_id TEXT REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  mrp NUMERIC(10, 2) DEFAULT 0,
  price NUMERIC(10, 2) DEFAULT 0,
  stock NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'In Stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.procurement_records (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  brand_id TEXT DEFAULT 'dairy',
  date DATE DEFAULT CURRENT_DATE,
  shift TEXT,
  farmer TEXT NOT NULL,
  qty NUMERIC(10, 2) NOT NULL,
  fat NUMERIC(5, 2),
  snf NUMERIC(5, 2),
  rate NUMERIC(10, 2),
  total NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and grants on optional relational tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selling_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public access to brands" ON public.brands;
CREATE POLICY "Allow public access to brands" ON public.brands FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to customers" ON public.customers;
CREATE POLICY "Allow public access to customers" ON public.customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to selling_items" ON public.selling_items;
CREATE POLICY "Allow public access to selling_items" ON public.selling_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to procurement_records" ON public.procurement_records;
CREATE POLICY "Allow public access to procurement_records" ON public.procurement_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.brands TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.customers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.selling_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.procurement_records TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Verification output
SELECT 
  'Supabase setup successful! Central table public.erp_state is ready with Realtime replication enabled.' AS status,
  count(*) AS total_state_records
FROM public.erp_state;
