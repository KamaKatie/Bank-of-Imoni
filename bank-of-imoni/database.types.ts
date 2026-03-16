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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      _view_definition_backups: {
        Row: {
          created_at: string
          view_definition: string | null
          view_name: string
          view_owner: string | null
          view_schema: string
        }
        Insert: {
          created_at?: string
          view_definition?: string | null
          view_name: string
          view_owner?: string | null
          view_schema: string
        }
        Update: {
          created_at?: string
          view_definition?: string | null
          view_name?: string
          view_owner?: string | null
          view_schema?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          current_balance: number | null
          icon: string
          id: string
          name: string
          placeholder_img: string
          type: string | null
          updated_at: string | null
          user: string
        }
        Insert: {
          current_balance?: number | null
          icon: string
          id?: string
          name: string
          placeholder_img?: string
          type?: string | null
          updated_at?: string | null
          user: string
        }
        Update: {
          current_balance?: number | null
          icon?: string
          id?: string
          name?: string
          placeholder_img?: string
          type?: string | null
          updated_at?: string | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          category_id: string | null
          group_id: string | null
          id: string
          name: string
          period: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          group_id?: string | null
          id?: string
          name: string
          period: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          group_id?: string | null
          id?: string
          name?: string
          period?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_category_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          data_url: string | null
          icon: string | null
          id: string
          name: string | null
          type: Database["public"]["Enums"]["transaction_types"] | null
          user_id: string | null
        }
        Insert: {
          data_url?: string | null
          icon?: string | null
          id?: string
          name?: string | null
          type?: Database["public"]["Enums"]["transaction_types"] | null
          user_id?: string | null
        }
        Update: {
          data_url?: string | null
          icon?: string | null
          id?: string
          name?: string | null
          type?: Database["public"]["Enums"]["transaction_types"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_contributions: {
        Row: {
          amount: number
          goal_id: string
          id: string
          transaction_id: string
          user_id: string | null
        }
        Insert: {
          amount: number
          goal_id: string
          id?: string
          transaction_id: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          goal_id?: string
          id?: string
          transaction_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gc_goal_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gc_transaction_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          completed: boolean | null
          created_at: string | null
          current_amount: number | null
          id: string
          name: string
          target_amount: number | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          current_amount?: number | null
          id?: string
          name: string
          target_amount?: number | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          current_amount?: number | null
          id?: string
          name?: string
          target_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string
          id: string
          image: string
          last_name: string
        }
        Insert: {
          first_name: string
          id: string
          image: string
          last_name: string
        }
        Update: {
          first_name?: string
          id?: string
          image?: string
          last_name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          date: string
          debt_impact: number | null
          deleted_at: string | null
          description: string
          id: string
          paid_by_account: string
          split_type: Database["public"]["Enums"]["split_types"] | null
          type: Database["public"]["Enums"]["transaction_types"]
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          date?: string
          debt_impact?: number | null
          deleted_at?: string | null
          description: string
          id?: string
          paid_by_account: string
          split_type?: Database["public"]["Enums"]["split_types"] | null
          type: Database["public"]["Enums"]["transaction_types"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          date?: string
          debt_impact?: number | null
          deleted_at?: string | null
          description?: string
          id?: string
          paid_by_account?: string
          split_type?: Database["public"]["Enums"]["split_types"] | null
          type?: Database["public"]["Enums"]["transaction_types"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_paid_by_account_fkey"
            columns: ["paid_by_account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          amount: number
          created_at: string | null
          from_account: string
          id: string
          to_account: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          from_account: string
          id?: string
          to_account: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          from_account?: string
          id?: string
          to_account?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfer_from_fkey"
            columns: ["from_account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_to_fkey"
            columns: ["to_account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      transaction_monthly_stats: {
        Row: {
          income: number | null
          month: string | null
          spending: number | null
          user: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _adjust_pair_balance: {
        Args: { delta: number; uid1: string; uid2: string }
        Returns: undefined
      }
      get_total_working_balance: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_working_balance: { Args: { account_uuid: string }; Returns: number }
      update_user_balance: {
        Args: { amount: number; u1: string; u2: string }
        Returns: undefined
      }
    }
    Enums: {
      split_types: "equal" | "full" | "none"
      transaction_types: "expense" | "income" | "transfer"
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
      split_types: ["equal", "full", "none"],
      transaction_types: ["expense", "income", "transfer"],
    },
  },
} as const
