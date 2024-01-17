import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kckmehlkypmfrtwgvynr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtja21laGxreXBtZnJ0d2d2eW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4NjA5ODAsImV4cCI6MjAxNzQzNjk4MH0.SbTPoooWo8BHmnFmR16K3xfccmmJJ29JHcV9f0hxTaE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
