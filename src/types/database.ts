export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'buyer' | 'supplier' | 'delivery_partner'
          business_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role: 'buyer' | 'supplier' | 'delivery_partner'
          business_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'buyer' | 'supplier' | 'delivery_partner'
          business_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      listings: {
        Row: {
          id: string
          supplier_id: string
          title: string
          description: string
          category: string
          price: number
          unit: string
          min_quantity: number
          max_quantity: number | null
          availability: boolean
          image_urls: string[]
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          title: string
          description: string
          category: string
          price: number
          unit: string
          min_quantity: number
          max_quantity?: number | null
          availability?: boolean
          image_urls?: string[]
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          title?: string
          description?: string
          category?: string
          price?: number
          unit?: string
          min_quantity?: number
          max_quantity?: number | null
          availability?: boolean
          image_urls?: string[]
          location?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          supplier_id: string
          listing_id: string
          quantity: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'in_transit' | 'delivered' | 'cancelled'
          delivery_address: string
          delivery_notes: string | null
          delivery_partner_id: string | null
          scheduled_delivery: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          supplier_id: string
          listing_id: string
          quantity: number
          total_amount: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'in_transit' | 'delivered' | 'cancelled'
          delivery_address: string
          delivery_notes?: string | null
          delivery_partner_id?: string | null
          scheduled_delivery?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          supplier_id?: string
          listing_id?: string
          quantity?: number
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'in_transit' | 'delivered' | 'cancelled'
          delivery_address?: string
          delivery_notes?: string | null
          delivery_partner_id?: string | null
          scheduled_delivery?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      delivery_tasks: {
        Row: {
          id: string
          order_id: string
          delivery_partner_id: string
          pickup_address: string
          delivery_address: string
          status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
          estimated_delivery: string | null
          actual_delivery: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          delivery_partner_id: string
          pickup_address: string
          delivery_address: string
          status?: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
          estimated_delivery?: string | null
          actual_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          delivery_partner_id?: string
          pickup_address?: string
          delivery_address?: string
          status?: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
          estimated_delivery?: string | null
          actual_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tasks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_tasks_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}