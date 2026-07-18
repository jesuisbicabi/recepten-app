import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://vvltibougsjwxwucbcbi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_p-KOhRynQ8rzdTEP7aF6sg_TRRMACVh";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
