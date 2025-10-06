// Basic types for Supabase database operations
export interface Database {
  public: {
    Tables: {
      profiles: any
      admin_actions: any
      // Add other tables as needed
    }
    Views: any
    Functions: any
    Enums: any
  }
}

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = any
export type TablesInsert<T extends keyof Database['public']['Tables']> = any
export type TablesUpdate<T extends keyof Database['public']['Tables']> = any
export type Enums<T extends keyof Database['public']['Enums']> = any

// More flexible types for when we need to work with unknown tables
export type AnyTableRow = Record<string, any>
export type AnyTableInsert = Record<string, any>
export type AnyTableUpdate = Record<string, any>

// Common types for database operations
export type DatabaseRow = Record<string, any>
export type DatabaseInsert = Record<string, any>
export type DatabaseUpdate = Record<string, any>
