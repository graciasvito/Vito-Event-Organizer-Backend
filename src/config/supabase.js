const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://kohhnpgzrfsxqcdsyalp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvaGhucGd6cmZzeHFjZHN5YWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwODc3MjgsImV4cCI6MTk3NzY2MzcyOH0.EgfG9VtuQiillUzdUkNt_5_Lpx5EVYiBbskNnkiky3w";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;