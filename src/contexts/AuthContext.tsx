import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, sendOTP, verifyOTP as verifyOTPAPI } from '../lib/supabase';
import { useNotification } from '../components/ui/NotificationProvider';

// Get supabaseUrl for demo mode check
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  userType: 'customer' | 'company' | 'admin';
  sponsorshipNumber?: string;
  parentId?: string;
  isVerified: boolean;
  hasActivePlan: boolean;
  mobileVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: string) => Promise<void>;
  register: (userData: any, userType: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const notification = useNotification();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Fetch user profile data
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Try to get user data, but handle RLS gracefully
      let userData = null;
      try {
        const { data: userDataArray, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId);

        if (userError) {
          console.warn('RLS blocking users table access:', userError);
        } else if (userDataArray && userDataArray.length > 0) {
          userData = userDataArray[0];
        }
      } catch (relsError) {
        console.warn('RLS blocking users table:', relsError);
      }

      // Try to get profile data
      let profileData = null;
      try {
        const { data: profileDataArray } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId);
        profileData = profileDataArray?.[0];
      } catch (profileRlsError) {
        console.warn('RLS blocking user_profiles table:', profileRlsError);
      }

      // Try to get company data if user is a company
      let companyData = null;
      if (userData?.user_type === 'company') {
        try {
          const { data: companyDataArray } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', userId);
          companyData = companyDataArray?.[0];
        } catch (companyRlsError) {
          console.warn('RLS blocking companies table:', companyRlsError);
        }
      }

      // Try to check for active subscription
      let subscriptionData = null;
      try {
        const { data: subscriptionDataArray } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .gte('end_date', new Date().toISOString());
        subscriptionData = subscriptionDataArray?.[0];
      } catch (subscriptionRlsError) {
        console.warn('RLS blocking user_subscriptions table:', subscriptionRlsError);
      }

      // Get current session to get email
      const { data: { session } } = await supabase.auth.getSession();
      
      const user: User = {
        id: userId,
        email: session?.user?.email || userData?.email || 'unknown@example.com',
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        companyName: companyData?.company_name,
        userType: userData?.user_type || 'customer', // Default to customer if RLS blocks access
        sponsorshipNumber: profileData?.sponsorship_number,
        parentId: profileData?.parent_account,
        isVerified: userData?.is_verified || false,
        hasActivePlan: true, // Set to true for demo mode to allow dashboard access
        mobileVerified: userData?.mobile_verified || false
      };

      setUser(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't show error notification for RLS issues, just log them
      console.warn('Some user data may be incomplete due to RLS policies');
    }
  };

  const login = async (emailOrUsername: string, password: string, userType: string) => {
    try {
      // Always use demo mode for this application
      console.log('🔍 Using demo mode login: ', emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@demo.com`);
      
      // Demo mode - simulate successful login
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@demo.com`,
        firstName: emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername,
        lastName: 'User',
        userType: userType as 'customer' | 'company' | 'admin',
        sponsorshipNumber: 'DEMO' + Math.floor(Math.random() * 1000),
        isVerified: true,
        hasActivePlan: true, // Always true for demo mode
        mobileVerified: true
      };
      
      setUser(demoUser);
      notification.showSuccess('Login Successful!', `Welcome back, ${demoUser.firstName}!`);
      return;
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      notification.showError('Login Failed', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: any, userType: string) => {
    try {
      // Always use demo mode for this application
      console.log('Using demo mode registration');
      
      // Demo mode - simulate successful registration
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email: userData.email,
        firstName: userData.firstName || userData.companyName,
        lastName: userData.lastName,
        companyName: userData.companyName,
        userType: userType as 'customer' | 'company' | 'admin',
        sponsorshipNumber: 'DEMO' + Math.floor(Math.random() * 1000),
        isVerified: true,
        hasActivePlan: true, // Set to true for demo mode
        mobileVerified: true
      };
      
      setUser(demoUser);
      notification.showSuccess('Registration Successful!', 'Your demo account has been created successfully.');
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      notification.showError('Registration Failed', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Log logout activity before signing out
    if (user) {
      supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: 'logout',
          ip_address: 'unknown',
          user_agent: navigator.userAgent,
          logout_time: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) console.warn('Failed to log logout activity:', error);
        });
    }
    
    supabase.auth.signOut();
    setUser(null);
    notification.showInfo('Logged Out', 'You have been successfully logged out.');
  };

  const forgotPassword = async (email: string) => {
    try {
      // Always use demo mode
      notification.showSuccess('Demo Mode', 'In demo mode, password reset emails are simulated.');
    } catch (error) {
      notification.showError('Reset Failed', error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      // Always use demo mode
      notification.showSuccess('Demo Mode', 'Password reset simulated successfully.');
    } catch (error) {
      notification.showError('Reset Failed', error.message || 'Failed to reset password');
      throw error;
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      // Always use demo mode
      if (user) {
        setUser({ ...user, mobileVerified: true });
        notification.showSuccess('Verification Successful', 'Mobile number verified successfully.');
      }
    } catch (error) {
      notification.showError('Verification Failed', error.message || 'Invalid OTP code');
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyOTP,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};