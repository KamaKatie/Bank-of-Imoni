import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/database.types";

export const createClient = <T = Database>() =>
  createBrowserClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );