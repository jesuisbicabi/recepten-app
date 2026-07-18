// Vereist dat het klassieke script https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
// al geladen is (zie index.html) — dat zet de globale window.supabase.createClient beschikbaar.

const SUPABASE_URL = "https://vvltibougsjwxwucbcbi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_p-KOhRynQ8rzdTEP7aF6sg_TRRMACVh";

export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
