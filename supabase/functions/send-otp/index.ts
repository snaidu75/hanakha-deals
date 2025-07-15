import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OTPRequest {
  user_id: string;
  contact_info: string;
  otp_type: 'email' | 'mobile';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, contact_info, otp_type }: OTPRequest = await req.json()

    // Generate 6-digit OTP
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Store OTP in database
    const { data: otpData, error: otpError } = await supabase
      .from('otp_verifications')
      .insert({
        user_id,
        otp_code,
        otp_type,
        contact_info,
        expires_at: expires_at.toISOString()
      })
      .select()
      .single()

    if (otpError) {
      throw otpError
    }

    // Send OTP based on type
    if (otp_type === 'email') {
      await sendEmailOTP(contact_info, otp_code)
    } else if (otp_type === 'mobile') {
      await sendSMSOTP(contact_info, otp_code)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `OTP sent to ${contact_info}`,
        otp_id: otpData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending OTP:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function sendEmailOTP(email: string, otp: string) {
  // Using Mailtrap for testing - replace with your actual SMTP settings
  const emailData = {
    from: { email: "noreply@mlmplatform.com", name: "MLM Platform" },
    to: [{ email }],
    subject: "Your OTP Code - MLM Platform",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Email Verification</h2>
        <p>Your OTP code is:</p>
        <div style="background: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px;">${otp}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  }

  // For testing, we'll just log the email content
  console.log('Email OTP would be sent:', emailData)
  
  // In production, integrate with your email service:
  // - Mailtrap (for testing): https://mailtrap.io/
  // - SendGrid: https://sendgrid.com/
  // - AWS SES: https://aws.amazon.com/ses/
  // - Resend: https://resend.com/
  
  return true
}

async function sendSMSOTP(mobile: string, otp: string) {
  // Using Twilio test credentials
  const accountSid = 'ACtest123456789' // Test Account SID
  const authToken = 'test_auth_token_123' // Test Auth Token
  const fromNumber = '+15005550006' // Twilio test number
  
  const message = `Your MLM Platform verification code is: ${otp}. This code expires in 10 minutes.`
  
  // For testing, we'll just log the SMS content
  console.log('SMS OTP would be sent:', {
    to: mobile,
    from: fromNumber,
    body: message
  })
  
  // In production, integrate with Twilio:
  /*
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const auth = btoa(`${accountSid}:${authToken}`)
  
  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: mobile,
      From: fromNumber,
      Body: message
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to send SMS')
  }
  */
  
  return true
}