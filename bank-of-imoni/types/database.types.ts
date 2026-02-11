export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          current_balance: number | null;
          group_id: string | null;
          icon: string | null;
          id: string;
          name: string;
          placeholder_img: string;
          type: string | null;
          updated_at: string | null;
          user: string | null;
        };
        Insert: {
          current_balance?: number | null;
          group_id?: string | null;
          icon?: string | null;
          id?: string;
          name?: string | null;
          placeholder_img?: string;
          type?: string | null;
          updated_at?: string | null;
          user?: string | null;
        };
        Update: {
          current_balance?: number | null;
          group_id?: string | null;
          icon?: string | null;
          id?: string;
          name?: string | null;
          placeholder_img?: string;
          type?: string | null;
          updated_at?: string | null;
          user?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      budgets: {
        Row: {
          amount: number;
          category_id: string | null;
          group_id: string | null;
          id: string;
          name: string;
          period: string;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          group_id?: string | null;
          id?: string;
          name: string;
          period: string;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          group_id?: string | null;
          id?: string;
          name?: string;
          period?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "budget_category_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "budget_group_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "budget_user_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          data_url: string | null;
          icon: string | null;
          id: string;
          name: string | null;
          type: Database["public"]["Enums"]["transaction_types"] | null;
        };
        Insert: {
          data_url?: string | null;
          icon?: string | null;
          id?: string;
          name?: string | null;
          type?: Database["public"]["Enums"]["transaction_types"] | null;
        };
        Update: {
          data_url?: string | null;
          icon?: string | null;
          id?: string;
          name?: string | null;
          type?: Database["public"]["Enums"]["transaction_types"] | null;
        };
        Relationships: [];
      };
      exchange_rates: {
        Row: {
          currency: string;
          id: number;
          rate: number;
          recorded_at: string;
          recorded_date: string | null;
        };
        Insert: {
          currency: string;
          id?: number;
          rate: number;
          recorded_at?: string;
          recorded_date?: string | null;
        };
        Update: {
          currency?: string;
          id?: number;
          rate?: number;
          recorded_at?: string;
          recorded_date?: string | null;
        };
        Relationships: [];
      };
      goal_contributions: {
        Row: {
          amount: number;
          goal_id: string;
          id: string;
          transaction_id: string;
        };
        Insert: {
          amount: number;
          goal_id: string;
          id?: string;
          transaction_id: string;
        };
        Update: {
          amount?: number;
          goal_id?: string;
          id?: string;
          transaction_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gc_goal_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gc_transaction_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          completed: boolean | null;
          created_at: string | null;
          group_id: string | null;
          id: string;
          name: string;
          owner_user: string | null;
          target_amount: number;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string | null;
          group_id?: string | null;
          id?: string;
          name: string;
          owner_user?: string | null;
          target_amount: number;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string | null;
          group_id?: string | null;
          id?: string;
          name?: string;
          owner_user?: string | null;
          target_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "goals_group_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goals_owner_fkey";
            columns: ["owner_user"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          first_name: string;
          id: string;
          image: string | null;
          last_name: string | null;
        };
        Insert: {
          first_name?: string | null;
          id: string;
          image?: string | null;
          last_name?: string | null;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          image?: string | null;
          last_name?: string | null;
        };
        Relationships: [];
      };
      transaction_participants: {
        Row: {
          id: string;
          settled: boolean | null;
          share_amount: number;
          transaction_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          settled?: boolean | null;
          share_amount: number;
          transaction_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          settled?: boolean | null;
          share_amount?: number;
          transaction_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tp_transaction_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tp_user_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          category: string | null;
          date: string;
          description: string;
          group_id: string | null;
          id: string;
          paid_by_account: string;
          type: Database["public"]["Enums"]["transaction_types"];
        };
        Insert: {
          amount: number;
          category?: string | null;
          date?: string;
          description: string;
          group_id?: string | null;
          id?: string;
          paid_by_account: string;
          type: Database["public"]["Enums"]["transaction_types"];
        };
        Update: {
          amount?: number;
          category?: string | null;
          date?: string;
          description?: string;
          group_id?: string | null;
          id?: string;
          paid_by_account?: string;
          type?: Database["public"]["Enums"]["transaction_types"];
        };
        Relationships: [
          {
            foreignKeyName: "transactions_category_fkey";
            columns: ["category"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_paid_by_account_fkey";
            columns: ["paid_by_account"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      transfers: {
        Row: {
          amount: number;
          created_at: string | null;
          from_account: string;
          group_id: string | null;
          id: string;
          to_account: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          from_account: string;
          group_id?: string | null;
          id?: string;
          to_account: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          from_account?: string;
          group_id?: string | null;
          id?: string;
          to_account?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transfer_from_fkey";
            columns: ["from_account"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_group_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_to_fkey";
            columns: ["to_account"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      user_groups: {
        Row: {
          group_id: string;
          joined_at: string | null;
          role: string | null;
          user_id: string;
        };
        Insert: {
          group_id: string;
          joined_at?: string | null;
          role?: string | null;
          user_id: string;
        };
        Update: {
          group_id?: string;
          joined_at?: string | null;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_groups_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_groups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      transaction_types: "expense" | "income" | "transfer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      transaction_types: ["expense", "income", "transfer"],
    },
  },
} as const;
