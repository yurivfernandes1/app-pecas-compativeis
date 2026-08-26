import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Fetch the premium price from the database
    const { data: settings, error: settingsError } = await supabaseClient
      .from('mk3_settings')
      .select('premium_price')
      .limit(1)
      .single();

    if (settingsError || !settings) {
      throw new Error('Failed to fetch premium price');
    }

    // Calculate price in cents
    const priceInCents = Math.round(settings.premium_price * 100);

    // Fetch user details for the email
    const { data: userData } = await supabaseClient
      .from('mk3_users')
      .select('username')
      .eq('id', user.id)
      .single();

    // Use the real email from Supabase Auth
    const email = user?.email;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      client_reference_id: user.id, // We'll use this in the webhook to identify the user
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Membro Premium',
              description: 'Carros e fotos ilimitadas na garagem, e selo VIP.',
            },
            unit_amount: priceInCents,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription', // Assinatura recorrente mensal
      success_url: `${req.headers.get('origin')}/minha-garagem?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${req.headers.get('origin')}/onboarding?canceled=true`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
