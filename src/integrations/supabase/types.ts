export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blockchain_transactions: {
        Row: {
          block_number: number
          data: Json
          event_id: string | null
          gas_used: number | null
          id: string
          product_id: string | null
          timestamp: string
          transaction_hash: string
          transaction_type: string
          verification_status:
            | Database["public"]["Enums"]["transaction_status"]
            | null
        }
        Insert: {
          block_number: number
          data: Json
          event_id?: string | null
          gas_used?: number | null
          id?: string
          product_id?: string | null
          timestamp?: string
          transaction_hash: string
          transaction_type: string
          verification_status?:
            | Database["public"]["Enums"]["transaction_status"]
            | null
        }
        Update: {
          block_number?: number
          data?: Json
          event_id?: string | null
          gas_used?: number | null
          id?: string
          product_id?: string | null
          timestamp?: string
          transaction_hash?: string
          transaction_type?: string
          verification_status?:
            | Database["public"]["Enums"]["transaction_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_transactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "supply_chain_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blockchain_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          blockchain_hash: string | null
          category: Database["public"]["Enums"]["product_category"]
          certifications: string[] | null
          created_at: string
          created_by: string | null
          cultivation_method: string | null
          description: string | null
          id: string
          name: string
          origin_location: string | null
          product_id: string
          qr_code_data: string | null
          updated_at: string
        }
        Insert: {
          blockchain_hash?: string | null
          category: Database["public"]["Enums"]["product_category"]
          certifications?: string[] | null
          created_at?: string
          created_by?: string | null
          cultivation_method?: string | null
          description?: string | null
          id?: string
          name: string
          origin_location?: string | null
          product_id: string
          qr_code_data?: string | null
          updated_at?: string
        }
        Update: {
          blockchain_hash?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          certifications?: string[] | null
          created_at?: string
          created_by?: string | null
          cultivation_method?: string | null
          description?: string | null
          id?: string
          name?: string
          origin_location?: string | null
          product_id?: string
          qr_code_data?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qr_scans: {
        Row: {
          id: string
          location: string | null
          product_id: string
          scanned_at: string
          scanner_ip: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          location?: string | null
          product_id: string
          scanned_at?: string
          scanner_ip?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          location?: string | null
          product_id?: string
          scanned_at?: string
          scanner_ip?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_scans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_chain_events: {
        Row: {
          actor_id: string | null
          actor_name: string
          blockchain_hash: string | null
          created_at: string
          humidity: number | null
          id: string
          images: string[] | null
          location: string
          notes: string | null
          product_id: string
          stage: Database["public"]["Enums"]["supply_chain_stage"]
          temperature: number | null
          timestamp: string
          verification_status:
            | Database["public"]["Enums"]["transaction_status"]
            | null
        }
        Insert: {
          actor_id?: string | null
          actor_name: string
          blockchain_hash?: string | null
          created_at?: string
          humidity?: number | null
          id?: string
          images?: string[] | null
          location: string
          notes?: string | null
          product_id: string
          stage: Database["public"]["Enums"]["supply_chain_stage"]
          temperature?: number | null
          timestamp?: string
          verification_status?:
            | Database["public"]["Enums"]["transaction_status"]
            | null
        }
        Update: {
          actor_id?: string | null
          actor_name?: string
          blockchain_hash?: string | null
          created_at?: string
          humidity?: number | null
          id?: string
          images?: string[] | null
          location?: string
          notes?: string | null
          product_id?: string
          stage?: Database["public"]["Enums"]["supply_chain_stage"]
          temperature?: number | null
          timestamp?: string
          verification_status?:
            | Database["public"]["Enums"]["transaction_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "supply_chain_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
      product_category:
        | "herb"
        | "powder"
        | "oil"
        | "capsule"
        | "tablet"
        | "tincture"
      supply_chain_stage:
        | "cultivation"
        | "harvesting"
        | "processing"
        | "packaging"
        | "distribution"
        | "retail"
      transaction_status: "pending" | "verified" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      product_category: [
        "herb",
        "powder",
        "oil",
        "capsule",
        "tablet",
        "tincture",
      ],
      supply_chain_stage: [
        "cultivation",
        "harvesting",
        "processing",
        "packaging",
        "distribution",
        "retail",
      ],
      transaction_status: ["pending", "verified", "completed"],
    },
  },
} as const
