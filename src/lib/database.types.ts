// Basic types for Supabase database operations
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_actions: {
        Row: {
          id: number;
          admin_id: string;
          action: string;
          target_user_id: string | null;
          payload: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: number;
          admin_id: string;
          action: string;
          target_user_id?: string | null;
          payload?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: number;
          admin_id?: string;
          action?: string;
          target_user_id?: string | null;
          payload?: Record<string, unknown>;
          created_at?: string;
        };
      };
      simulado_attempts: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          finished_at: string | null;
          total_questions: number;
          correct_answers: number;
          score: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at?: string;
          finished_at?: string | null;
          total_questions?: number;
          correct_answers?: number;
          score?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          started_at?: string;
          finished_at?: string | null;
          total_questions?: number;
          correct_answers?: number;
          score?: number;
        };
      };
      simulado_answers: {
        Row: {
          id: number;
          attempt_id: string;
          question_id: string;
          selected_letter: string;
          correct_letter: string;
          is_correct: boolean;
          answered_at: string;
        };
        Insert: {
          id?: number;
          attempt_id: string;
          question_id: string;
          selected_letter: string;
          correct_letter: string;
          is_correct: boolean;
          answered_at?: string;
        };
        Update: {
          id?: number;
          attempt_id?: string;
          question_id?: string;
          selected_letter?: string;
          correct_letter?: string;
          is_correct?: boolean;
          answered_at?: string;
        };
      };
      question_metadata: {
        Row: {
          id: number;
          question_id: string;
          questao_numero: number | null;
          componente: string | null;
          ano_exame: number | null;
          dificuldade: string | null;
          competency_desc: string | null;
          skill_code: string | null;
          skill_desc: string | null;
          extra_info: string | null;
          knowledge_objects: Record<string, unknown> | null;
        };
        Insert: {
          id?: number;
          question_id: string;
          questao_numero?: number | null;
          componente?: string | null;
          ano_exame?: number | null;
          dificuldade?: string | null;
          competency_desc?: string | null;
          skill_code?: string | null;
          skill_desc?: string | null;
          extra_info?: string | null;
          knowledge_objects?: Record<string, unknown> | null;
        };
        Update: {
          id?: number;
          question_id?: string;
          questao_numero?: number | null;
          componente?: string | null;
          ano_exame?: number | null;
          dificuldade?: string | null;
          competency_desc?: string | null;
          skill_code?: string | null;
          skill_desc?: string | null;
          extra_info?: string | null;
          knowledge_objects?: Record<string, unknown> | null;
        };
      };
      questions: {
        Row: {
          id: string;
          prompt: string;
          alt_a_text: string;
          alt_b_text: string;
          alt_c_text: string;
          alt_d_text: string;
          alt_a_justification: string;
          alt_b_justification: string;
          alt_c_justification: string;
          alt_d_justification: string;
          correct_letter: string;
          image_url: string | null;
          component: string | null;
          difficulty: string | null;
          natural_key: string | null;
          text1_title: string | null;
          text1_content: string | null;
          text1_source: string | null;
          text2_title: string | null;
          text2_content: string | null;
          year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          prompt: string;
          alt_a_text: string;
          alt_b_text: string;
          alt_c_text: string;
          alt_d_text: string;
          alt_a_justification?: string;
          alt_b_justification?: string;
          alt_c_justification?: string;
          alt_d_justification?: string;
          correct_letter: string;
          image_url?: string | null;
          component?: string | null;
          difficulty?: string | null;
          natural_key?: string | null;
          text1_title?: string | null;
          text1_content?: string | null;
          text1_source?: string | null;
          text2_title?: string | null;
          text2_content?: string | null;
          year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          prompt?: string;
          alt_a_text?: string;
          alt_b_text?: string;
          alt_c_text?: string;
          alt_d_text?: string;
          alt_a_justification?: string;
          alt_b_justification?: string;
          alt_c_justification?: string;
          alt_d_justification?: string;
          correct_letter?: string;
          image_url?: string | null;
          component?: string | null;
          difficulty?: string | null;
          natural_key?: string | null;
          text1_title?: string | null;
          text1_content?: string | null;
          text1_source?: string | null;
          text2_title?: string | null;
          text2_content?: string | null;
          year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// More flexible types for when we need to work with unknown tables
export type AnyTableRow = Record<string, unknown>
export type AnyTableInsert = Record<string, unknown>
export type AnyTableUpdate = Record<string, unknown>

// Common types for database operations
export type DatabaseRow = Record<string, unknown>
export type DatabaseInsert = Record<string, unknown>
export type DatabaseUpdate = Record<string, unknown>
