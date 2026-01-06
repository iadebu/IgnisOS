import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqpkgcrgcyuimufmvqaa.supabase.co'  // Ejemplo: https://xxxxx.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcGtnY3JnY3l1aW11Zm12cWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3ODQzNDYsImV4cCI6MjA3OTM2MDM0Nn0.MFt07PFxoVTAt_rBWo3wH50p3fTXAkEZiZfgDcTcDJs' // La clave larga que copiaste

export const supabase = createClient(supabaseUrl, supabaseAnonKey)