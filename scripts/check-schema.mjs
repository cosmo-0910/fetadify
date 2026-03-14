import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  const tables = ['services', 'projects', 'messages', 'bookings', 'posts', 'subscribers', 'contacts', 'ai_replies', 'profiles'];
  console.log("--- SCHEMA AUDIT START ---");
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table "${table}": ERROR - ${error.message}`);
      } else if (data && data.length > 0) {
        console.log(`Table "${table}": Columns - ${Object.keys(data[0]).join(', ')}`);
      } else {
        // If empty, try to get info from a generic query if possible, or just note it's empty
        console.log(`Table "${table}": EMPTY (found, but no data to infer columns)`);
      }
    } catch (e) {
      console.log(`Table "${table}": CRITICAL FAILURE - ${e.message}`);
    }
  }
  console.log("--- SCHEMA AUDIT END ---");
}

checkSchema();
