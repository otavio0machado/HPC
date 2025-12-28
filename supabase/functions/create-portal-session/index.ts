
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})

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
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Usuário não autenticado')
        }

        let customerId = user.user_metadata?.stripe_customer_id

        if (!customerId) {
            console.log(`No customer ID found for user ${user.id}, searching by email ${user.email}`)
            const customers = await stripe.customers.list({
                email: user.email,
                limit: 1,
            })

            if (customers.data.length > 0) {
                customerId = customers.data[0].id
                console.log(`Found customer ID ${customerId} by email`)

                // Opcional: Salvar para o futuro (requer service_role key)
                // Isso pode ser feito aqui ou deixado apenas para o webhook,
                // mas fazer aqui garante consistência imediata se o webhook falhou.
            } else {
                throw new Error('Assinatura não encontrada. Por favor, entre em contato com o suporte.')
            }
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.headers.get('origin')}/dashboard`,
        })

        return new Response(
            JSON.stringify({ url: session.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
