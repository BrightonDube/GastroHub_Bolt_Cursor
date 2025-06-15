# GastroHub Project Task Breakdown

## 1. Project Foundation & Backend Setup
### 1.1 Project Initialization and Dependency Setup
- [x] Initialize React + Vite project with TypeScript template
- [x] Install dependencies: react-router-dom, @supabase/supabase-js, @tanstack/react-query, zustand, react-hook-form, zod, @hookform/resolvers, tailwindcss, postcss, autoprefixer, lucide-react, date-fns
- [x] Create `.env` file and add Supabase credentials
- [x] Initialize Tailwind CSS and PostCSS config

### 1.2 Database Schema and Supabase Client Setup
- [x] Set up Supabase database schema using provided SQL
- [x] Create Supabase Storage buckets (`avatars`, `listings-images`, `verification-documents`)
- [x] Implement `src/supabaseClient.ts` singleton

---

## 2. Design System & UI/UX Guidelines
### 2.1 Color Palette & Typography
- [x] Implement color palette in Tailwind config
- [x] Import and use Poppins and Inter fonts
- [x] Apply typography rules to headings, body, buttons

### 2.2 Layout & Components
- [x] Build two-column main layout (sidebar + content)
- [x] Create Card, Button, and Form UI components
- [x] Style forms and inputs per design system

---

## 3. Routing & Global UI
### 3.1 Tailwind, Global Styles, and Layout Components
- [x] Configure Tailwind with custom theme
- [x] Set up global styles in `src/index.css`
- [x] Implement `AuthLayout` and `DashboardLayout` components

### 3.2 App Routing and Protected Routes Setup
- [x] Implement `ProtectedRoute` component
- [x] Define all app routes in router
- [x] Add route guards for dashboard pages

---

## 4. Authentication and Onboarding Flow
- [x] Implement Supabase Auth (sign up, sign in, sign out)
- [x] Build onboarding flow for each user persona (Buyer, Supplier, Delivery Partner)
- [x] Create profile completion and verification screens

---

## 5. Supplier Portal
- [x] Supplier dashboard UI
- [x] CRUD for product/service listings
- [x] Order management for suppliers
- [x] Supplier metrics dashboard (use stored procedure)

---

## 6. Buyer Portal
- [x] Buyer dashboard UI
- [x] Product/service browsing and search
- [x] Place orders (cart, checkout)
- [x] Order tracking for buyers
- [x] Buyer spend summary dashboard (use stored procedure)

---

## 7. Delivery Partner Portal
- [x] Delivery partner dashboard UI
- [x] List and accept delivery tasks
- [x] Confirm pickups and deliveries
- [x] Upload and verify driver documents

---

## 8. Shared Features & Advanced Logic
- [x] Messaging system (direct messages, order-context)
- [x] Invoice generation and management
- [ ] Notifications (edge functions)
- [ ] Row Level Security (RLS) policy implementation

---

## 9. Supabase Backend Advanced Features
- [ ] Implement RLS policies for all tables  
  _No direct evidence in frontend code; backend verification required._
- [ ] Implement stored procedures for metrics and summaries  
  _No direct evidence in frontend code; backend verification required._
- [ ] Implement edge functions: revenuecat-webhook, create-invoice-and-delivery, notify-users  
  _No edge function or webhook logic found in codebase._
- [ ] Implement messaging system (direct messages, order-context)
    - [x] Scope and design messaging system (order-context, all user types, real-time)
    - [x] Define Supabase schema for messages and conversations (`supabase_schema.sql`)
    - [ ] Implement real-time messaging backend (Supabase tables, triggers, policies)
    - [x] Scaffold frontend messaging components (chat UI, order context)
    - [ ] Integrate Supabase Realtime for live updates
    - [ ] Add conversation list/inbox per user
    - [ ] Add order-context chat to order details page
    - [ ] Add unread message indicators and notifications
    - [ ] Write tests for messaging logic
    - [ ] Document messaging feature for users and devs
- [ ] Implement invoice generation and management
    - [x] Scope and design invoice management (auto-generation, supplier confirmation, PDF/email)
    - [x] Define Supabase schema for invoices (`supabase_schema.sql`)
    - [x] Create CategorySelector component (tree/hierarchical dropdown, add category/subcategory)
    - [x] Integrate CategorySelector into ProductForm (replace current select)
    - [x] Add CategoryManagementPage for user custom categories (dashboard)
    - [x] Ensure ability to add user-specific categories/subcategories inline and in management page
    - [x] Ensure categories are displayed in alphabetical order in all category trees and selectors
    - [x] Remove all emoji support from category creation, editing, and display
    - [ ] Implement invoice generation logic (auto-generate on order, backend)
    - [ ] Implement supplier confirmation and send action
    - [ ] Implement PDF export for invoices
    - [ ] Implement email delivery of invoices
    - [ ] Scaffold frontend invoice viewing/downloading (buyers, suppliers, admins)
    - [ ] Add invoice status tracking (draft, confirmed, sent, paid, cancelled)
    - [ ] Write tests for invoice logic
    - [ ] Document invoice feature for users and devs
- [ ] Implement notifications (edge functions, in-app, or email)  
  _No notification system found in frontend code._

---

## 10. Testing & QA
- [x] Unit tests for all major logic  
  _Test files found for auth, orders, UI, hooks, and utilities._
- [ ] Integration tests for flows (auth, order, delivery)  
  _No integration test files found._
- [ ] Manual QA for all user roles  
  _No manual QA scripts or documentation found._

---

## 11. Deployment & Documentation
- [ ] Prepare production build  
  _No build or deployment scripts found._
- [ ] Deploy frontend and configure environment  
  _No deployment pipeline or configuration found._
- [ ] Write and update documentation  
  _README.md exists but is empty except for project name; documentation missing._

---

*For each item, further subtasks can be added as needed for your workflow or team. Expand this file as the project evolves.*
