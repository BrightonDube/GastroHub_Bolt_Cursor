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
      articles: {
        Row: {
          author: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_hour: {
        Row: {
          close_time: string | null
          created_at: string | null
          day_of_week: string
          id: string
          is_closed: boolean | null
          open_time: string | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          close_time?: string | null
          created_at?: string | null
          day_of_week: string
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          close_time?: string | null
          created_at?: string | null
          day_of_week?: string
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_item: {
        Row: {
          added_at: string | null
          id: string
          product_id: string | null
          quantity: number
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["id"]
          },
        ]
      }
      category: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation: {
        Row: {
          archived: boolean | null
          created_at: string | null
          id: string
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      conversation_participant: {
        Row: {
          conversation_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participant_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversation"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_category: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "custom_category"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zone: {
        Row: {
          base_delivery_fee: number | null
          cities: string[] | null
          created_at: string | null
          estimated_delivery_hours: number | null
          free_delivery_threshold: number | null
          id: string
          is_active: boolean | null
          max_delivery_distance: number | null
          postal_codes: string[] | null
          supplier_id: string | null
          updated_at: string | null
          zone_name: string
        }
        Insert: {
          base_delivery_fee?: number | null
          cities?: string[] | null
          created_at?: string | null
          estimated_delivery_hours?: number | null
          free_delivery_threshold?: number | null
          id?: string
          is_active?: boolean | null
          max_delivery_distance?: number | null
          postal_codes?: string[] | null
          supplier_id?: string | null
          updated_at?: string | null
          zone_name: string
        }
        Update: {
          base_delivery_fee?: number | null
          cities?: string[] | null
          created_at?: string | null
          estimated_delivery_hours?: number | null
          free_delivery_threshold?: number | null
          id?: string
          is_active?: boolean | null
          max_delivery_distance?: number | null
          postal_codes?: string[] | null
          supplier_id?: string | null
          updated_at?: string | null
          zone_name?: string
        }
        Relationships: []
      }
      favorite: {
        Row: {
          created_at: string | null
          id: string
          target_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category_id: string | null
          created_at: string | null
          current_stock: number
          description: string | null
          id: string
          is_available: boolean | null
          listing_id: string | null
          minimum_stock: number | null
          product_name: string
          supplier_id: string
          unit_price: number
          unit_type: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          is_available?: boolean | null
          listing_id?: string | null
          minimum_stock?: number | null
          product_name: string
          supplier_id: string
          unit_price: number
          unit_type: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          is_available?: boolean | null
          listing_id?: string | null
          minimum_stock?: number | null
          product_name?: string
          supplier_id?: string
          unit_price?: number
          unit_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          id: string
          order_id: string | null
          pdf_url: string | null
          sent_at: string | null
          status: string
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      listing: {
        Row: {
          availability: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          location: string | null
          max_quantity: number | null
          min_quantity: number | null
          price: number
          product_code: string | null
          stock_quantity: number | null
          supplier_id: string | null
          title: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          availability?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string | null
          max_quantity?: number | null
          min_quantity?: number | null
          price: number
          product_code?: string | null
          stock_quantity?: number | null
          supplier_id?: string | null
          title: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          availability?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string | null
          max_quantity?: number | null
          min_quantity?: number | null
          price?: number
          product_code?: string | null
          stock_quantity?: number | null
          supplier_id?: string | null
          title?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message: {
        Row: {
          body: string
          conversation_id: string | null
          created_at: string | null
          id: string
          read_at: string | null
          sender_id: string | null
        }
        Insert: {
          body: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string | null
        }
        Update: {
          body?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversation"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          estimated_delivery_date: string | null
          id: string
          payment_status: string | null
          status: string
          supplier_id: string | null
          total_amount: number | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          estimated_delivery_date?: string | null
          id?: string
          payment_status?: string | null
          status: string
          supplier_id?: string | null
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          estimated_delivery_date?: string | null
          id?: string
          payment_status?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_item: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking: {
        Row: {
          id: string
          order_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_method: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          is_default: boolean | null
          method_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          is_default?: boolean | null
          method_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          is_default?: boolean | null
          method_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      push_notification_tokens: {
        Row: {
          created_at: string | null
          id: number
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      review: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          reviewer_id: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          reviewer_id?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          reviewer_id?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_period: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          billing_period?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          billing_period?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
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
      app_role: "admin" | "moderator" | "user"
      DeliveryStatus:
        | "PENDING"
        | "ASSIGNED"
        | "PICKED_UP"
        | "IN_TRANSIT"
        | "DELIVERED"
        | "FAILED"
      OrderStatus:
        | "PENDING"
        | "APPROVED"
        | "REJECTED"
        | "IN_PREPARATION"
        | "READY_FOR_PICKUP"
        | "IN_TRANSIT"
        | "DELIVERED"
        | "CANCELLED"
      UserRole: "SUPPLIER" | "BUYER" | "DELIVERY_PARTNER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      DeliveryStatus: [
        "PENDING",
        "ASSIGNED",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "FAILED",
      ],
      OrderStatus: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "IN_PREPARATION",
        "READY_FOR_PICKUP",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ],
      UserRole: ["SUPPLIER", "BUYER", "DELIVERY_PARTNER"],
    },
  },
} as const
