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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      airdrops: {
        Row: {
          amount_per_user: number
          created_at: string | null
          description: string | null
          eligibility_criteria: Json | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          token_id: string | null
          total_amount: number
        }
        Insert: {
          amount_per_user: number
          created_at?: string | null
          description?: string | null
          eligibility_criteria?: Json | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          token_id?: string | null
          total_amount: number
        }
        Update: {
          amount_per_user?: number
          created_at?: string | null
          description?: string | null
          eligibility_criteria?: Json | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          token_id?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "airdrops_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      balances: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          locked_balance: number | null
          token_id: string | null
          updated_at: string | null
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          locked_balance?: number | null
          token_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          locked_balance?: number | null
          token_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "balances_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balances_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      beta_access: {
        Row: {
          access_level: string | null
          created_at: string | null
          expires_at: string | null
          feature_name: string
          granted_at: string | null
          id: string
          is_active: boolean | null
          user_id: string | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          expires_at?: string | null
          feature_name: string
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          expires_at?: string | null
          feature_name?: string
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beta_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staking: {
        Row: {
          amount: number
          apy: number
          created_at: string | null
          end_date: string | null
          id: string
          lock_period_days: number | null
          rewards_earned: number | null
          start_date: string | null
          status: string | null
          token_id: string | null
          updated_at: string | null
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          apy: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          lock_period_days?: number | null
          rewards_earned?: number | null
          start_date?: string | null
          status?: string | null
          token_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          apy?: number
          created_at?: string | null
          end_date?: string | null
          id?: string
          lock_period_days?: number | null
          rewards_earned?: number | null
          start_date?: string | null
          status?: string | null
          token_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staking_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staking_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          id: string
          message: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          contract_address: string | null
          created_at: string | null
          decimals: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          network: string
          symbol: string
        }
        Insert: {
          contract_address?: string | null
          created_at?: string | null
          decimals?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          network: string
          symbol: string
        }
        Update: {
          contract_address?: string | null
          created_at?: string | null
          decimals?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          network?: string
          symbol?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          block_number: number | null
          created_at: string | null
          fee: number | null
          id: string
          metadata: Json | null
          network: string | null
          status: string | null
          token_id: string | null
          transaction_type: string
          tx_hash: string | null
          updated_at: string | null
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          block_number?: number | null
          created_at?: string | null
          fee?: number | null
          id?: string
          metadata?: Json | null
          network?: string | null
          status?: string | null
          token_id?: string | null
          transaction_type: string
          tx_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          block_number?: number | null
          created_at?: string | null
          fee?: number | null
          id?: string
          metadata?: Json | null
          network?: string | null
          status?: string | null
          token_id?: string | null
          transaction_type?: string
          tx_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_airdrops: {
        Row: {
          airdrop_id: string | null
          amount_claimed: number
          claimed_at: string | null
          created_at: string | null
          id: string
          status: string | null
          tx_hash: string | null
          user_id: string | null
        }
        Insert: {
          airdrop_id?: string | null
          amount_claimed: number
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          tx_hash?: string | null
          user_id?: string | null
        }
        Update: {
          airdrop_id?: string | null
          amount_claimed?: number
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          tx_hash?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_airdrops_airdrop_id_fkey"
            columns: ["airdrop_id"]
            isOneToOne: false
            referencedRelation: "airdrops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_airdrops_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          updated_at: string | null
          username: string | null
          verification_level: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
          verification_level?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
          verification_level?: number | null
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          created_at: string | null
          documents: Json | null
          id: string
          processed_at: string | null
          rejection_reason: string | null
          status: string | null
          submitted_at: string | null
          user_id: string | null
          verification_type: string
        }
        Insert: {
          created_at?: string | null
          documents?: Json | null
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verification_type: string
        }
        Update: {
          created_at?: string | null
          documents?: Json | null
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          created_at: string | null
          id: string
          is_connected: boolean | null
          last_connected_at: string | null
          updated_at: string | null
          user_id: string | null
          wallet_address: string
          wallet_name: string | null
          wallet_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_connected_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address: string
          wallet_name?: string | null
          wallet_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_connected_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string
          wallet_name?: string | null
          wallet_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
