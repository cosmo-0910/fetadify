const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAlphaAdmin() {
  const email = 'admin@transhub.com';
  const password = 'm0&64))8fffff';

  console.log(`Attempting to sign in/up alpha admin: ${email}`);

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.log("Sign in failed, trying sign up...", signInError.message);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Sign up failed too:", signUpError.message);
      return;
    }
    
    if (signUpData.user) {
      console.log("Signed up successfully.");
      await syncProfile(signUpData.user.id, email);
    }
  } else if (signInData.user) {
    console.log("Signed in successfully. Syncing profile...");
    await syncProfile(signInData.user.id, email);
  }
}

async function syncProfile(userId, email) {
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert([
      { 
        user_id: userId, 
        email: email, 
        role: 'admin' 
      }
    ], { onConflict: 'user_id' });

  if (profileError) {
    console.error("Error syncing profile:", profileError.message);
  } else {
    console.log("Alpha admin profile synced successfully.");
  }
}

createAlphaAdmin();
