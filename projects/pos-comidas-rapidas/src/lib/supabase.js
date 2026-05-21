import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nxohuoweehtjjecucrdo.supabase.co';
// Usamos la llave que nos diste. Si en el futuro falla, asegúrate de reemplazarla por la "anon public key" de Supabase (que normalmente empieza por eyJ...).
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54b2h1b3dlZWh0amplY3VjcmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTYzMzAsImV4cCI6MjA5NDA5MjMzMH0.2k80TbrPQztdic8wpdt0R-TP4r_tAAReolDRlQ4QcmM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
