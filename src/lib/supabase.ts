import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://zeowjikcjreeprjeokra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplb3dqaWtjanJlZXByamVva3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTk1NzEsImV4cCI6MjA4MjY3NTU3MX0.eGVcgylLPVBoLj6p7Uk1Y0AZqkCogkvbLPQT0RG1LPw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
