import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
      }
    }
  
)

export default supabase