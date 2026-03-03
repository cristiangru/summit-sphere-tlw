// src/lib/supabase/test.ts
import { createClient } from '../supabase/server';

export async function testConnection() {
  try {
    const supabase = await createClient();
   const { data, error } = await supabase
  .from('events')
  .select('*')
  .limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error);
    return false;
  }
}