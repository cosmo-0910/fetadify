import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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

  console.log(`Attempting to create alpha admin: ${email}`);

  // 1. Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log("User already exists in Auth. Proceeding to update profile...");
      // Try to find the user session/id if they exist
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.error("Could not sign in to update profile:", signInError.message);
        return;
      }
      
      await syncProfile(signInData.user.id, email);
    } else {
      console.error("Error signing up:", authError.message);
    }
    return;
  }

  if (authData.user) {
    console.log("User created in Auth successfully.");
    await syncProfile(authData.user.id, email);
  }
}

async function syncProfile(userId, email) {
  // 2. Insert into profiles table
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
    console.error("Error creating/updating profile:", profileError.message);
    console.log("Note: Make sure your 'profiles' table exists and RLS allows this insertion.");
  } else {
    console.log("Alpha admin profile synced successfully.");
    console.log("NOTE: If email confirmation is enabled in Supabase, you must confirm the email before logging in.");
  }
}

createAlphaAdmin();
