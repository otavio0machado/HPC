
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature || !endpointSecret) {
        return new Response('Webhook Error: Missing signature or secret', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret)

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const userId = session.client_reference_id

            console.log(`Payment successful for user ${userId}`)

            // Init Admin Supabase Client
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            // Update User Metadata to PRO
            const { error } = await supabaseAdmin.auth.admin.updateUserById(
                userId,
                { user_metadata: { subscription_tier: 'pro' } }
            )

            if (error) {
                console.error('Error updating user metadata:', error)
                return new Response('Error updating user', { status: 500 })
            }
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 })

    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message)
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }
})
