import { createClient } from '@supabase/supabase-js'

// Use fallback values for demo purposes when environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'
console.log(supabaseUrl);
console.log(supabaseAnonKey);
// Only log in development
if (import.meta.env.DEV) {
  console.log('Environment check:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Present' : 'Missing',
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'mlm-platform'
    }
  },
  db: {
    schema: 'public'
  }
})

// Database types
export interface User {
  id: string
  email: string
  user_type: 'customer' | 'company' | 'admin'
  is_verified: boolean
  email_verified: boolean
  mobile_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  username?: string
  mobile?: string
  gender?: string
  sponsorship_number?: string
  parent_account?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  user_id: string
  company_name: string
  brand_name?: string
  business_type?: string
  business_category?: string
  registration_number: string
  gstin: string
  website_url?: string
  official_email: string
  affiliate_code?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price: number
  duration_days: number
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MLMTreeNode {
  id: string
  user_id: string
  parent_id?: string
  left_child_id?: string
  right_child_id?: string
  level: number
  position: 'left' | 'right' | 'root'
  sponsorship_number: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OTPVerification {
  id: string
  user_id: string
  otp_code: string
  otp_type: 'email' | 'mobile' | 'password_reset'
  contact_info: string
  is_verified: boolean
  expires_at: string
  attempts: number
  created_at: string
}

// API functions
export const sendOTP = async (userId: string, contactInfo: string, otpType: 'email' | 'mobile') => {
  const { data, error } = await supabase.functions.invoke('send-otp', {
    body: {
      user_id: userId,
      contact_info: contactInfo,
      otp_type: otpType
    }
  })

  if (error) throw error
  return data
}

export const verifyOTP = async (userId: string, otpCode: string, otpType: 'email' | 'mobile') => {
  const { data, error } = await supabase.functions.invoke('verify-otp', {
    body: {
      user_id: userId,
      otp_code: otpCode,
      otp_type: otpType
    }
  })

  if (error) throw error
  return data
}

export const getSubscriptionPlans = async () => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price')

  if (error) throw error
  return data
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export const getMLMTreeNode = async (userId: string) => {
  const { data, error } = await supabase
    .from('mlm_tree')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export const getSystemSettings = async () => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')

  if (error) throw error
  
  // Convert to key-value object
  const settings: Record<string, any> = {}
  data.forEach(setting => {
    settings[setting.setting_key] = setting.setting_value
  })
  
  return settings
}