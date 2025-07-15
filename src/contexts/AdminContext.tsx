import React, { createContext, useContext, useState } from 'react';

interface GeneralSettings {
  siteName: string;
  logoUrl: string;
  dateFormat: string;
  timezone: string;
  emailVerificationRequired: boolean;
  mobileVerificationRequired: boolean;
  referralMandatory: boolean;
  defaultParentAccount: string;
}

interface SMSGateway {
  provider: string;
  apiKey: string;
  apiSecret: string;
  senderId: string;
}

interface EmailSMTP {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

interface AdminContextType {
  settings: GeneralSettings;
  smsGateway: SMSGateway;
  emailSMTP: EmailSMTP;
  subscriptionPlans: SubscriptionPlan[];
  updateSettings: (settings: Partial<GeneralSettings>) => void;
  updateSMSGateway: (gateway: SMSGateway) => void;
  updateEmailSMTP: (smtp: EmailSMTP) => void;
  updateSubscriptionPlans: (plans: SubscriptionPlan[]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GeneralSettings>({
    siteName: 'HanakhaDeals',
    logoUrl: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'UTC',
    emailVerificationRequired: true,
    mobileVerificationRequired: true,
    referralMandatory: false,
    defaultParentAccount: 'admin-default'
  });

  const [smsGateway, setSMSGateway] = useState<SMSGateway>({
    provider: 'Twilio',
    apiKey: '',
    apiSecret: '',
    senderId: 'MLM-PLATFORM'
  });

  const [emailSMTP, setEmailSMTP] = useState<EmailSMTP>({
    host: 'smtp.gmail.com',
    port: 587,
    username: '',
    password: '',
    encryption: 'TLS'
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Basic Plan',
      price: 99,
      duration: 30,
      features: ['MLM Tree Access', 'Basic Dashboard', 'Email Support'],
      isActive: true
    },
    {
      id: '2',
      name: 'Premium Plan',
      price: 199,
      duration: 30,
      features: ['MLM Tree Access', 'Advanced Dashboard', 'Priority Support', 'Analytics'],
      isActive: true
    },
    {
      id: '3',
      name: 'Enterprise Plan',
      price: 399,
      duration: 30,
      features: ['MLM Tree Access', 'Advanced Dashboard', 'Priority Support', 'Analytics', 'Custom Branding', 'API Access'],
      isActive: true
    }
  ]);

  const updateSettings = (newSettings: Partial<GeneralSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateSMSGateway = (gateway: SMSGateway) => {
    setSMSGateway(gateway);
  };

  const updateEmailSMTP = (smtp: EmailSMTP) => {
    setEmailSMTP(smtp);
  };

  const updateSubscriptionPlans = (plans: SubscriptionPlan[]) => {
    setSubscriptionPlans(plans);
  };

  const value = {
    settings,
    smsGateway,
    emailSMTP,
    subscriptionPlans,
    updateSettings,
    updateSMSGateway,
    updateEmailSMTP,
    updateSubscriptionPlans
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};