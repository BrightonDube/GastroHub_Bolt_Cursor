# GastroHub: Full Project Specification & Bolt.dev Implementation Plan (React + Vite Edition)
**Version**: 1.0  
**Date**: June 15, 2025  

## Table of Contents
- [Project Overview](#project-overview)
  - [What is GastroHub?](#what-is-gastrohub)
  - [Core User Personas](#core-user-personas)
  - [Technology Stack](#technology-stack)
- [Design System & UI/UX Guidelines](#design-system--uiux-guidelines)
  - [Color Palette](#color-palette)
  - [Typography](#typography)
  - [Layout & Components](#layout--components)
- [Supabase Backend Architecture](#supabase-backend-architecture)
  - [Full Database Schema (SQL CREATE TABLE statements)](#full-database-schema-sql-create-table-statements)
  - [Row Level Security (RLS) Policies Philosophy](#row-level-security-rls-policies-philosophy)
  - [Stored Procedures (Postgres Functions)](#stored-procedures-postgres-functions)
  - [Edge Functions](#edge-functions)
- [Feature Implementation Prompts for bolt.new (React + Vite)](#feature-implementation-prompts-for-boltnew-react--vite)
  - [Part 1: Project Foundation & Backend Setup](#part-1-project-foundation--backend-setup)
  - [Part 2: Routing & Global UI](#part-2-routing--global-ui)
  - [Part 3: Authentication and Onboarding Flow](#part-3-authentication-and-onboarding-flow)
  - [Part 4: Supplier Portal](#part-4-supplier-portal)
  - [Part 5: Buyer Portal](#part-5-buyer-portal)
  - [Part 6: Delivery Partner Portal](#part-6-delivery-partner-portal)
  - [Part 7: Shared Features & Advanced Logic](#part-7-shared-features--advanced-logic)

## Project Overview

### What is GastroHub?
GastroHub is a comprehensive B2B digital marketplace designed to connect the entire hospitality supply chain in South Africa. It serves as a centralized platform for procurement, logistics, and communication between hospitality venues (Buyers), their suppliers (Suppliers), and the delivery services that bridge the gap (Delivery Partners).

### Core User Personas
- **Buyer (Restaurant, Hotel, Cafe)**: The procurement manager or chef who needs to order goods and services. They value efficiency, price comparison, reliable delivery, and consolidated invoicing.
- **Supplier (Farm, Wholesaler, Service Provider)**: The business owner or sales manager who wants to reach more customers, streamline order management, and manage their inventory and deliveries effectively.
- **Delivery Partner (Driver, Logistics Company)**: An independent driver or small logistics company looking for delivery tasks. They need clear instructions, efficient routing, and a simple way to manage pickups and drop-offs.

### Technology Stack
- **Framework**: React with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Postgres DB, Storage, Realtime, Edge Functions)
- **Subscriptions/Billing**: RevenueCat
- **UI Components**: Headless UI for accessibility, Radix UI primitives
- **State Management**: React Query (@tanstack/react-query) for server state, Zustand for minimal global client state
- **Forms**: React Hook Form with Zod for validation

## Design System & UI/UX Guidelines
(This section is framework-agnostic and defines the visual identity of the application.)

### Color Palette

| Name            | Hex       | Usage                                                  |
|-----------------|-----------|--------------------------------------------------------|
| Primary         | #0D3D56   | Main buttons, active links, key headers, accents       |
| Secondary       | #FFC759   | Secondary buttons, highlights, tags, calls to action   |
| Background      | #F7F9FA   | Main app background                                    |
| Surface         | #FFFFFF   | Cards, modals, sidebars                                |
| Text Primary    | #1A202C   | Headings, primary text content                         |
| Text Secondary  | #4A5568   | Subheadings, descriptions, muted text                  |
| Success         | #38A169   | Success messages, confirmation icons                   |
| Warning         | #D69E2E   | Warnings, pending statuses                             |
| Error           | #E53E3E   | Error messages, validation errors, danger actions      |
| Border/Stroke   | #E2E8F0   | Card borders, dividers, input field borders            |

### Typography
- **Primary Font (Headings & UI)**: Poppins (from Google Fonts)
- **Secondary Font (Body Content)**: Inter (from Google Fonts)

| Element         | Font    | Weight       | Size (Tailwind) |
|-----------------|---------|--------------|-----------------|
| H1 (Page Title) | Poppins | 700 (Bold)   | text-3xl        |
| H2 (Section)    | Poppins | 600 (Semi)   | text-2xl        |
| H3 (Card Title) | Poppins | 600 (Semi)   | text-xl         |
| Body            | Inter   | 400 (Reg)    | text-base       |
| Small/Muted     | Inter   | 400 (Reg)    | text-sm         |
| Button Text     | Poppins | 500 (Med)    | text-base       |

### Layout & Components
- **Main Layout**: A two-column layout: a fixed sidebar on the left and a main content area on the right.
- **Cards**: Use `bg-surface`, `border`, `border-stroke`, `rounded-lg`, and `shadow-md`.
- **Buttons**: Primary, Secondary, Destructive, and Ghost/Link styles using the color palette.
- **Forms**: Inputs should be `bg-white`, `border`, `border-stroke`, `rounded-md`, `focus:ring-2`, `focus:ring-primary`.

## Supabase Backend Architecture
(This section is backend-specific and remains unchanged regardless of the frontend framework.)

### Full Database Schema (SQL CREATE TABLE statements)
```sql
-- Enum types for status fields
CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'delivery_partner');
CREATE TYPE order_status AS ENUM ('pending_approval', 'approved', 'rejected', 'ready_for_pickup', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('pending', 'accepted', 'pickup_confirmed', 'delivery_confirmed', 'cancelled');
CREATE TYPE document_type AS ENUM ('id_document', 'proof_of_address', 'drivers_license', 'company_registration');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'failed');

-- Profiles table linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone_number TEXT,
  address JSONB, -- { street, city, province, postal_code, country }
  avatar_url TEXT,
  is_onboarded BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE, -- For drivers
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Product/Service listings by Suppliers
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC(10, 2) NOT NULL,
  unit TEXT, -- e.g., 'kg', 'box', 'hour'
  stock_quantity INT,
  image_urls TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Orders placed by Buyers
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_status order_status NOT NULL DEFAULT 'pending_approval',
  total_amount NUMERIC(10, 2) NOT NULL,
  delivery_address JSONB NOT NULL,
  delivery_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Line items for each order
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Delivery tasks for Delivery Partners
CREATE TABLE delivery_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id),
  delivery_partner_id UUID REFERENCES profiles(id), -- Nullable until accepted
  delivery_status delivery_status NOT NULL DEFAULT 'pending',
  pickup_address JSONB NOT NULL,
  delivery_address JSONB NOT NULL,
  pickup_eta TIMESTAMPTZ,
  delivery_eta TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
ALTER TABLE delivery_tasks ENABLE ROW LEVEL SECURITY;

-- Documents for verification (mainly for drivers)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  is_verified BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Simple direct messaging system
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  order_context_id UUID REFERENCES orders(id), -- Optional: Link message to an order
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Invoices for billing
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  supplier_id UUID NOT NULL REFERENCES profiles(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  invoice_number TEXT UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  due_date DATE,
  payment_status payment_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
```

### Row Level Security (RLS) Policies Philosophy
RLS is non-negotiable for security. The general rules will be:
- Users can only see and edit their own profiles row.
- **Suppliers**: Can manage their own listings. Can see orders and delivery_tasks where they are the `supplier_id`.
- **Buyers**: Can see all listings. Can only see orders and delivery_tasks where they are the `buyer_id`.
- **Delivery Partners**: Can see delivery_tasks that are pending (unassigned). Once accepted, they can only see tasks assigned to them.

### Stored Procedures (Postgres Functions)
```sql
-- Function for Supplier Dashboard Metrics
CREATE OR REPLACE FUNCTION get_supplier_dashboard_metrics(p_supplier_id UUID)
RETURNS TABLE(total_revenue NUMERIC, pending_orders BIGINT, completed_orders BIGINT, unique_buyers BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(o.total_amount) FILTER (WHERE o.order_status = 'delivered'), 0) as total_revenue,
    COUNT(*) FILTER (WHERE o.order_status = 'pending_approval' OR o.order_status = 'approved') as pending_orders,
    COUNT(*) FILTER (WHERE o.order_status = 'delivered') as completed_orders,
    COUNT(DISTINCT o.buyer_id) as unique_buyers
  FROM orders o
  WHERE o.supplier_id = p_supplier_id;
END;
$$ LANGUAGE plpgsql;

-- Function for Buyer Spending Summary
CREATE OR REPLACE FUNCTION get_buyer_spend_summary(p_buyer_id UUID)
RETURNS TABLE(supplier_id UUID, supplier_name TEXT, total_spent NUMERIC, order_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id as supplier_id,
    s.company_name as supplier_name,
    SUM(o.total_amount) as total_spent,
    COUNT(o.id) as order_count
  FROM orders o
  JOIN profiles s ON o.supplier_id = s.id
  WHERE o.buyer_id = p_buyer_id AND o.order_status = 'delivered'
  GROUP BY s.id, s.company_name
  ORDER BY total_spent DESC;
END;
$$ LANGUAGE plpgsql;
```

### Edge Functions
- `revenuecat-webhook`
- `create-invoice-and-delivery`
- `notify-users`

## Feature Implementation Prompts for bolt.new (React + Vite)

### Part 1: Project Foundation & Backend Setup

#### Step 1: Project Initialization and Dependency Setup
**Objective**: Initialize the React + Vite project with all required libraries.  
**Prompt**:  
"Initialize a new React project using Vite with the TypeScript template:  
```bash
npm create vite@latest gastrohub-app -- --template react-ts
```  
Navigate into the project directory and install the following dependencies:  
- Routing: `npm install react-router-dom`  
- Supabase: `npm install @supabase/supabase-js`  
- State Management: `npm install @tanstack/react-query zustand`  
- Forms: `npm install react-hook-form zod @hookform/resolvers`  
- Styling & UI: `npm install -D tailwindcss postcss autoprefixer` and `npm install lucide-react date-fns`  

Next, create a `.env` file in the root directory and add your Supabase credentials, prefixed with `VITE_`:  
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```  
Initialize Tailwind CSS by running `npx tailwindcss init -p`. This will create `tailwind.config.js` and `postcss.config.js`."

#### Step 2: Database Schema and Supabase Client Setup
**Objective**: Set up the Supabase database schema and create a singleton client instance for the app.  
**Prompt**:  
"First, go to your Supabase project's SQL Editor and run the entire SQL script from the 'Full Database Schema' section of our project document to create all tables and types.  
Next, create the Supabase Storage buckets from the dashboard:  
- `avatars` (public)  
- `listings-images` (public)  
- `verification-documents` (private)  

Now, let's create the Supabase client. In your Vite project, create a new file `src/supabaseClient.ts`:  
```typescript
// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```  
This file will be the single source for the Supabase client throughout the application."

### Part 2: Routing & Global UI

#### Step 3: Tailwind, Global Styles, and Layout Components
**Objective**: Configure Tailwind CSS and create the main application layout components.  
**Prompt**:  
"Let's configure Tailwind CSS. Open `tailwind.config.js` and update it with our design system:  
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        primary: '#0D3D56',
        secondary: '#FFC759',
        background: '#F7F9FA',
        surface: '#FFFFFF',
        'text-primary': '#1A202C',
        'text-secondary': '#4A5568',
        success: '#38A169',
        warning: '#D69E2E',
        error: '#E53E3E',
        'border-stroke': '#E2E8F0',
      },
      fontFamily: { poppins: ['Poppins', 'sans-serif'], inter: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
```  
Next, open `src/index.css` and replace its content with the Tailwind directives and font imports:  
```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-background text-text-primary font-inter;
}
```  
Now, create the layout components in `src/components/layouts/`:  

**AuthLayout**: `src/components/layouts/AuthLayout.tsx`.  
```tsx
// src/components/layouts/AuthLayout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-md border border-border-stroke">
        {children}
      </div>
    </main>
  );
}
```  

**DashboardLayout**: `src/components/layouts/DashboardLayout.tsx`.  
```tsx
// src/components/layouts/DashboardLayout.tsx
export default function DashboardLayout({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-surface border-r border-border-stroke p-6 flex-shrink-0">
        {sidebar}
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```"

#### Step 4: App Routing and Protected Routes Setup
**Objective**: Configure react-router-dom for all app routes and create a system for protecting dashboard routes.  
**Prompt**:  
"Let's set up the application's routing.  
First, create a `ProtectedRoute` component in `src/components/auth/ProtectedRoute.tsx`. This will handle authentication checks.  
```tsx
// src/components/auth/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Session } from '@supabase/supabase-js';

export default function ProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
}
```  
Now, update `src/App.tsx` to define all the routes for the application. Wrap all authenticated routes inside the `ProtectedRoute`.  
```tsx
// src/App.tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Import all your page components here...

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/onboarding/role-selection', element: <RoleSelectionPage /> },
      // ... other protected routes
    ],
  },
  { path: '/', element: <Navigate to="/login" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```  
Finally, wrap the App component in `src/main.tsx` with `QueryClientProvider` for react-query."

### Part 3: Authentication and Onboarding Flow

#### Step 5: Sign Up Page
**Objective**: Create the user registration page.  
**Prompt**:  
"Create the sign-up page at `src/pages/SignUpPage.tsx`.  
- **Layout**: Use the `AuthLayout` component.  
- **UI**: A heading, a form with Email and Password fields, a 'Sign Up' button, a 'Sign in with Google' button, and a `<Link to='/login'>` component from react-router-dom.  
- **Functionality**:  
  - Import `supabase` from `../supabaseClient`.  
  - On form submission, call `supabase.auth.signUp()`. Show a success message on completion.  
  - The Google button should call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })`."

#### Step 6: Login Page and Redirection Logic
**Objective**: Create the login page and handle post-login redirection.  
**Prompt**:  
"Create the login page at `src/pages/LoginPage.tsx`.  
- **Layout**: Use `AuthLayout`.  
- **UI**: A heading, a form for Email and Password, buttons for 'Login' and 'Sign in with Google', and a link to the signup page.  
- **Functionality**:  
  - Import `useNavigate` from react-router-dom and `supabase` from `../supabaseClient`.  
  - Create an `handleLogin` async function. Inside, call `supabase.auth.signInWithPassword()`.  
  - If sign-in is successful, query the `profiles` table for the user's `role` and `is_onboarded` status.  
  - If not onboarded, `navigate('/onboarding/role-selection')`.  
  - If onboarded, use a switch statement on the `role` to navigate to the correct dashboard (`/supplier/dashboard`, `/buyer/dashboard`, etc.)."

#### Step 7: Onboarding - Role Selection Page
**Objective**: Create the page where a user chooses their primary role.  
**Prompt**:  
"Create `src/pages/onboarding/RoleSelectionPage.tsx`. This is a protected route.  
- **UI**: A full-page centered layout with three large clickable cards for 'Buyer', 'Supplier', and 'Delivery Partner', each with an icon and description.  
- **Functionality**:  
  - On card click, call an `handleRoleSelect` function that takes the `role` as an argument.  
  - The function performs an upsert to the `profiles` table with the user's ID and the selected `role`.  
  - On success, use `useNavigate` to redirect to `/onboarding/profile-details`."

#### Step 8: Onboarding - Profile Details Form
**Objective**: Create a dynamic form to collect profile information.  
**Prompt**:  
"Create `src/pages/onboarding/ProfileDetailsPage.tsx`.  
- **UI**: Use `AuthLayout`. The form should conditionally render fields.  
- **Functionality**:  
  - Use react-query's `useQuery` to fetch the user's profile to get their `role`.  
  - Render fields for Full Name, Phone Number, Avatar Upload for all. Add Company Name and Address for Buyers/Suppliers.  
  - Handle avatar uploads to Supabase Storage.  
  - On submit, update the `profiles` table.  
  - Based on the `role`, either redirect to `/onboarding/document-upload` (for drivers) or set `is_onboarded: true` and redirect to the appropriate dashboard."

### Part 4: Supplier Portal

#### Step 9: Supplier Dashboard Page & Layout
**Objective**: Create the main dashboard layout and data display for Suppliers.  
**Prompt**:  
"Create the Supplier dashboard at `src/pages/supplier/DashboardPage.tsx`. Use a shared layout component `src/pages/supplier/SupplierLayout.tsx` that includes the `DashboardLayout` and a new `SupplierSidebar`.  
- **SupplierSidebar**: Create in `src/components/sidebars/`. It should contain `NavLink` components from react-router-dom for active styling to: Dashboard, Listings, and Orders.  
- **SupplierLayout**: This component will render the `DashboardLayout` with the `SupplierSidebar` and an `<Outlet />` from react-router-dom for the child pages.  
- **DashboardPage**:  
  - **UI**: Page title, 4 stat cards, and a "Recent Orders" table.  
  - **Functionality**: Use react-query's `useQuery` to fetch all data. For stats, call the `get_supplier_dashboard_metrics` RPC function. For the table, select the latest 5 orders."

#### Step 10: Supplier Listings Management Page
**Objective**: Build the page for suppliers to view and quickly manage their product listings.  
**Prompt**:  
"Create the listings page at `src/pages/supplier/ListingsPage.tsx`.  
- **UI**:  
  - Page title `h1` "My Listings".  
  - A "Create New Listing" button linking to `/supplier/listings/new`.  
  - Display listings in a grid. Each card shows the image, name, price, and stock.  
  - Each card has an "Edit" button and an "Active" toggle switch.  
- **Functionality**:  
  - Use `useQuery` to fetch all listings for the current supplier.  
  - Use react-query's `useMutation` for the toggle switch. On toggle, call a function that updates the `is_active` field. The mutation should invalidate the listings query to refetch the data."

#### Step 11: Create/Edit Listing Form Page
**Objective**: Build the form for creating and editing listings.  
**Prompt**:  
"Create `src/pages/supplier/NewListingPage.tsx` and `src/pages/supplier/EditListingPage.tsx`. They will share a single form component: `src/components/forms/ListingForm.tsx`.  
- **ListingForm**: Accepts an optional `initialData` prop. Uses `react-hook-form` and includes a multi-file uploader for images.  
- **NewListingPage**: Renders the form. `onSubmit` inserts a new row into the `listings` table and navigates to the listings page.  
- **EditListingPage**: Uses `useParams` from react-router-dom to get the listing ID. Fetches the listing data with `useQuery`. Renders the form with `initialData`. `onSubmit` updates the existing row."

#### Step 12: Supplier Order Management Page
**Objective**: Build the interface for suppliers to process incoming orders.  
**Prompt**:  
"Create `src/pages/supplier/OrdersPage.tsx` and a detail page `src/pages/supplier/OrderDetailPage.tsx`.  
- **OrdersPage**:  
  - **UI**: Title, tabs to filter by `order_status`, and a data table of orders. Each row links to the detail page.  
  - **Functionality**: Use component state to manage the active tab and filter the `useQuery` fetch accordingly.  
- **OrderDetailPage**:  
  - **UI**: Display all order details and a list of `order_items`. Show conditional action buttons ('Approve'/'Reject' or 'Mark as Ready').  
  - **Functionality**: Use `useParams` to get the order ID. Use `useMutation` for the action buttons to update the order status. The 'Approve' mutation should also trigger the `create-invoice-and-delivery` Edge Function."

### Part 5: Buyer Portal

#### Step 13: Buyer Dashboard Page & Layout
**Objective**: Create the main dashboard and layout for Buyers.  
**Prompt**:  
"Create the Buyer dashboard at `src/pages/buyer/DashboardPage.tsx`. Use a shared layout component `src/pages/buyer/BuyerLayout.tsx` that includes the `DashboardLayout` and a new `BuyerSidebar`.  
- **BuyerSidebar**: Create in `src/components/sidebars/`. It should contain `NavLink` components from react-router-dom for active styling, linking to:  
  - Dashboard (`/buyer/dashboard`)  
  - Discover Suppliers (`/buyer/discover`)  
  - My Orders (`/buyer/orders`)  
  - Profile (`/profile`)  
- **BuyerLayout**: This component will render the `DashboardLayout` with the `BuyerSidebar` and an `<Outlet />` from react-router-dom for the child pages.  
- **DashboardPage**:  
  - **UI**: Page title `h1` "Buyer Dashboard". "Quick Actions" buttons for "Browse Suppliers" and "View My Orders". A "Recent Orders" table and a "Spending Summary" section.  
  - **Functionality**: Use react-query's `useQuery` for all data fetching. For the spending summary, call the `get_buyer_spend_summary` RPC function. For recent orders, select the buyer's 5 most recent orders."

#### Step 14: Supplier & Listing Discovery Page
**Objective**: Build a page where buyers can search and filter suppliers and their listings.  
**Prompt**:  
"Create the discovery page at `src/pages/buyer/DiscoverPage.tsx`.  
- **UI**: A two-column layout. The left column contains search and filter controls. The right column displays a grid of `ListingCard` components.  
  - **Filter Controls**: A text input for search, and a list of checkboxes for category filtering.  
  - **Listing Grid**: Each `ListingCard` shows the product image, name, price, and the supplier's company name.  
- **Functionality**:  
  - Use `useState` to manage the search term and selected categories.  
  - Use a debouncing custom hook for the search input to avoid excessive queries.  
  - The main `useQuery` to fetch listings should be dependent on the search and filter state. When the state changes, react-query will automatically refetch.  
  - Each `ListingCard` should link to the individual listing detail page: `/listings/[id]`."

#### Step 15: Client-Side Cart (Zustand Store Setup)
**Objective**: Create a global state management store for the shopping cart.  
**Prompt**:  
"Create a new file at `src/stores/cartStore.ts` to manage the shopping cart state using Zustand.  
**File**: `src/stores/cartStore.ts`  
**Store Shape (State)**:  
- `items`: An array of objects: `{ listingId: string, supplierId: string, name: string, price: number, image_url: string, quantity: number }`.  
- `isOpen`: A boolean to control cart visibility.  
**Store Actions**:  
- `addItem(item)`: If the cart is empty OR the new item's `supplierId` matches the existing items, add it or increment quantity. Otherwise, `alert()` the user: "You can only order from one supplier at a time. Please clear your cart to start a new order."  
- `removeItem(listingId)`  
- `updateQuantity(listingId, quantity)`  
- `clearCart()`  
- `toggleCart()`  
- `getCartTotal()`: A derived function for the total price.  
- `getCartCount()`: A derived function for the total number of items."

#### Step 16: Listing Detail Page & "Add to Cart"
**Objective**: Build the detailed view for a single listing and connect it to the cart.  
**Prompt**:  
"Create a dynamic route page for listing details. In your `App.tsx` router setup, add a route: `{ path: '/listings/:id', element: <ListingDetailPage /> }`.  
**File**: `src/pages/ListingDetailPage.tsx`  
- **UI**:  
  - Display all listing details: image carousel, name, description, price, unit.  
  - Show supplier information.  
  - Include an "Add to Cart" section with a quantity input and a button.  
- **Functionality**:  
  - Use `useParams` to get the listing `:id`.  
  - Use `useQuery` to fetch the details for that specific listing.  
  - Import and use the `useCartStore` hook.  
  - The "Add to Cart" button's `onClick` handler should call the `addItem` action from the cart store with the current listing's details."

#### Step 17: Cart UI Component
**Objective**: Create a visible component for the user to interact with their cart.  
**Prompt**:  
"Create a `Cart` component at `src/components/cart/Cart.tsx`. This will be a slide-over panel from the right side of the screen.  
- **UI**:  
  - The component's visibility is controlled by `isOpen` from the `cartStore`. Use CSS transitions for a smooth slide-in/out effect.  
  - Display a list of items currently in the cart. Each item should show its image, name, quantity (with +/- buttons), and price.  
  - Show the cart subtotal at the bottom.  
  - Include a "Checkout" button (a `<Link>` to `/checkout`) and a "Clear Cart" button.  
- **Functionality**:  
  - The component should get all its data and actions from `useCartStore`.  
  - The +/- buttons should call the `updateQuantity` action. A remove icon should call `removeItem`.  
  - The "Clear Cart" button should call `clearCart`.  
- **Integration**: Add this `<Cart />` component to your main application layout file(s) so it's available on all pages where a user might shop."

#### Step 18: Checkout Page Logic
**Objective**: Create the final checkout page where a buyer places an order.  
**Prompt**:  
"Create the checkout page at `src/pages/CheckoutPage.tsx`. This is a protected route.  
- **UI**: A two-column layout.  
  - **Left Column**: A form for "Delivery Information". Pre-fill the user's address from their profile but allow editing. Include a `delivery_notes` textarea.  
  - **Right Column**: "Order Summary" listing items from the cart, subtotal, and total. A large "Place Order" button.  
- **Functionality**:  
  - Use `useNavigate` for redirection and `useCartStore` for cart data. Redirect to the discovery page if the cart is empty.  
  - The "Place Order" button should trigger an `handlePlaceOrder` async function.  
  - This function should be a `useMutation` from react-query.  
  - **Mutation Logic**:  
    - Get all necessary data: cart items, delivery details, user ID, supplier ID.  
    - **Step A**: Insert a single new row into the `orders` table.  
    - **Step B**: Using the `order_id` from the previous step, perform a bulk insert of all cart items into the `order_items` table.  
    - If successful, the mutation's `onSuccess` callback should:  
      - Call `clearCart()` from the cart store.  
      - Navigate to a success page, e.g., `/orders/success/[orderId]`."

### Part 6: Delivery Partner Portal

#### Step 19: Driver Dashboard & Layout
**Objective**: Build the dashboard for delivery partners to see available and ongoing tasks.  
**Prompt**:  
"Create the Driver dashboard at `src/pages/driver/DashboardPage.tsx`. Use a shared layout `src/pages/driver/DriverLayout.tsx` with a `DriverSidebar`.  
- **DriverSidebar**: `NavLinks` to Dashboard and Profile.  
- **DriverLayout**: Renders `DashboardLayout` with `DriverSidebar` and an `<Outlet />`.  
- **DashboardPage**:  
  - **UI**: Page title. Two tabs: "Available Tasks" and "My Tasks".  
  - **Functionality**:  
    - **Available Tasks tab**: `useQuery` to fetch tasks from `delivery_tasks` where `delivery_status` is 'pending' and the driver's profile `is_verified`. Display each as a card with pickup/drop-off info and an "Accept Task" button.  
    - **My Tasks tab**: `useQuery` to fetch tasks where `delivery_partner_id` matches the current user. Group or sort them by status."

#### Step 20: Driver Task Management
**Objective**: Implement the logic for a driver to accept and complete a task.  
**Prompt**:  
"Enhance the `DashboardPage` and create a `TaskDetailPage`.  
- **Accepting a Task**:  
  - The "Accept Task" button on the dashboard should trigger a `useMutation`.  
  - **Mutation Logic**: Updates the `delivery_tasks` row to set the `delivery_partner_id` to the current user's ID and changes the `delivery_status` to 'accepted'.  
  - On success, invalidate the queries for both "Available Tasks" and "My Tasks" to trigger a refetch and update the UI.  
- **Task Detail Page**:  
  - Create a route `{ path: '/driver/tasks/:id', element: <TaskDetailPage /> }`.  
  - **UI**: Display full task details: maps links for addresses, contact info. Show a sequence of buttons based on the current status.  
  - **Functionality**:  
    - If status is 'accepted', show "Confirm Pickup". Clicking triggers a mutation to update status to 'pickup_confirmed'.  
    - If status is 'pickup_confirmed', show "Confirm Delivery". Clicking triggers a mutation to update status to 'delivery_confirmed' AND update the master `orders` table status to 'delivered'."

### Part 7: Shared Features & Advanced Logic

#### Step 21: Realtime Messaging Component
**Objective**: Implement a chat component that updates in real-time.  
**Prompt**:  
"Create a reusable chat component at `src/components/chat/OrderChat.tsx`.  
- **Props**: `orderId: string`.  
- **UI**: A chat window with a message display area and a text input form. Differentiate between the current user's messages and the other party's messages by alignment and color.  
- **Functionality**:  
  - Use `useQuery` to fetch the initial set of messages for the `orderId`.  
  - **Real-time Subscription**: Use a `useEffect` hook to subscribe to inserts on the `messages` table using Supabase Realtime.  
  ```javascript
  useEffect(() => {
    const channel = supabase.channel(`chat:${orderId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `order_context_id=eq.${orderId}` },
        (payload) => {
          queryClient.setQueryData(['messages', orderId], (oldData) => [...oldData, payload.new]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, orderId, queryClient]);
  ```  
  - The send button should trigger a `useMutation` to insert a new row into the `messages` table."

#### Step 22: Implementing Stored Procedures (RPC calls)
**Objective**: Ensure correct usage of Supabase RPC calls for dashboard metrics.  
**Prompt**:  
"Refine the data fetching logic on the Supplier and Buyer dashboards.  
- **Supplier Dashboard**:  
  - The `useQuery` for fetching the stat card data must use `supabase.rpc()` to call the `get_supplier_dashboard_metrics` function.  
  - The query key should reflect this, e.g., `['supplierMetrics', userId]`.  
  - The query function will look like this:  
  ```javascript
  queryFn: async () => {
    const { data, error } = await supabase.rpc('get_supplier_dashboard_metrics', { p_supplier_id: userId });
    if (error) throw new Error(error.message);
    return data;
  }
  ```  
- **Buyer Dashboard**:  
  - Similarly, the `useQuery` for the "Spending Summary" section must use `supabase.rpc()` to call `get_buyer_spend_summary`."

#### Step 23: Creating and Deploying Supabase Edge Functions
**Objective**: Create the backend logic for the `create-invoice-and-delivery` task.  
**Prompt**:  
"Now, create the Supabase Edge Function that gets triggered when a supplier approves an order.  
- **Setup**: In your project's `supabase` directory (if you don't have one, run `supabase init`), run `supabase functions new create-invoice-and-delivery`.  
- **File**: `supabase/functions/create-invoice-and-delivery/index.ts`  
- **Function Logic**:  
  - The function must handle a POST request and parse the `order_id` from the body.  
  - It must create an Admin Supabase Client to bypass RLS policies.  
  - **Core Logic**:  
    - Fetch the full order details.  
    - Fetch the supplier's address for the pickup location.  
    - Insert a new row into the `invoices` table.  
    - Insert a new row into the `delivery_tasks` table.  
    - Return a 200 OK response on success or a 500 error on failure.  
- **Deployment**: Run `supabase functions deploy create-invoice-and-delivery --project-ref YOUR_PROJECT_REF`.  
- **Frontend Integration**: The `useMutation` for the "Approve Order" button (in `OrderDetailPage.tsx`) should, on success of updating the order status, make a `fetch` call to this deployed Edge Function's URL."