-- Add essay text column to simulados if it doesn't exist
alter table simulados add column if not exists essay_text text;
-- Ensure ai_analysis is JSONB for better structure (it might be text already, so let's try to cast or assume text is fine for MVP but JSONB is better)
-- For now, I'll stick to storing the AI JSON response as text or JSONB. Let's make it JSONB if possible.
-- alter table simulados alter column ai_analysis type jsonb using ai_analysis::jsonb; 
-- (Skipping strict type change to avoid easy errors if data is bad, text is safe)
