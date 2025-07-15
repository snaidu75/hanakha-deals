import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyOTPRequest {
  user_id: string;
  otp_code: string;
  otp_type: 'email' | 'mobile';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, otp_code, otp_type }: VerifyOTPRequest = await req.json()

    // Find the OTP record
    const { data: otpRecord, error: findError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('user_id', user_id)
      .eq('otp_code', otp_code)
      .eq('otp_type', otp_type)
      .eq('is_verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (findError || !otpRecord) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired OTP' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Mark OTP as verified
    const { error: updateOTPError } = await supabase
      .from('otp_verifications')
      .update({ is_verified: true })
      .eq('id', otpRecord.id)

    if (updateOTPError) {
      throw updateOTPError
    }

    // Update user verification status
    const updateData: any = {}
    if (otp_type === 'email') {
      updateData.email_verified = true
    } else if (otp_type === 'mobile') {
      updateData.mobile_verified = true
    }

    const { error: updateUserError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user_id)

    if (updateUserError) {
      throw updateUserError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${otp_type} verified successfully` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error verifying OTP:', error)
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