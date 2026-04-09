// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Types matching our database schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          passport_id: string;
          subscription_status: 'active' | 'canceled' | 'past_due' | 'none';
          test_completed: boolean;
          test_result: any | null;
          telegram_joined: boolean;
          joined_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      test_results: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          percentage: number;
          title: string;
          title_emoji: string;
          answers: any;
          completed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['test_results']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['test_results']['Insert']>;
      };
      lottery_draws: {
        Row: {
          id: string;
          month: string;
          draw_date: string;
          winner_user_id: string | null;
          charity_family_id: string | null;
          winner_amount: number | null;
          charity_amount: number | null;
          total_pool: number;
          status: 'upcoming' | 'drawn' | 'paid';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lottery_draws']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['lottery_draws']['Insert']>;
      };
      charity_families: {
        Row: {
          id: string;
          family_name: string;
          story: string;
          nominated_by_user_id: string;
          status: 'nominated' | 'shortlisted' | 'winner' | 'paid';
          amount_received: number | null;
          thank_you_message: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['charity_families']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['charity_families']['Insert']>;
      };
    };
  };
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Helper functions
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createUser(userData: Database['public']['Tables']['users']['Insert']) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserSubscription(
  userId: string, 
  status: 'active' | 'canceled' | 'past_due' | 'none'
) {
  const { data, error } = await supabase
    .from('users')
    .update({ subscription_status: status })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function saveTestResult(
  userId: string,
  result: {
    score: number;
    percentage: number;
    title: string;
    titleEmoji: string;
    answers: any;
  }
) {
  // Save test result
  const { data: testData, error: testError } = await supabase
    .from('test_results')
    .insert({
      user_id: userId,
      score: result.score,
      percentage: result.percentage,
      title: result.title,
      title_emoji: result.titleEmoji,
      answers: result.answers,
      completed_at: new Date().toISOString()
    })
    .select()
    .single();

  if (testError) throw testError;

  // Update user's test_completed status and result
  const { data: userData, error: userError } = await supabase
    .from('users')
    .update({
      test_completed: true,
      test_result: result
    })
    .eq('id', userId)
    .select()
    .single();

  if (userError) throw userError;

  return { testData, userData };
}

export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('users')
    .select('name, passport_id, test_result')
    .eq('test_completed', true)
    .not('test_result', 'is', null)
    .order('test_result->percentage', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getLotteryHistory() {
  const { data, error } = await supabase
    .from('lottery_draws')
    .select(`
      *,
      winner:users!lottery_draws_winner_user_id_fkey(name),
      charity:charity_families!lottery_draws_charity_family_id_fkey(family_name)
    `)
    .order('draw_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createLotteryDraw(drawData: Database['public']['Tables']['lottery_draws']['Insert']) {
  const { data, error } = await supabaseAdmin
    .from('lottery_draws')
    .insert(drawData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCharityFamilies(status?: string) {
  let query = supabase
    .from('charity_families')
    .select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function nominateCharityFamily(
  userId: string,
  familyData: {
    family_name: string;
    story: string;
  }
) {
  const { data, error } = await supabase
    .from('charity_families')
    .insert({
      family_name: familyData.family_name,
      story: familyData.story,
      nominated_by_user_id: userId,
      status: 'nominated'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
