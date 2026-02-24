"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { useSupabaseFetch } from "./use-supabase-fetch";

type Tables = Database["public"]["Tables"];
type ProfilesTable = Tables["profiles"];

export type Profile = ProfilesTable["Row"];

export function useAuth() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const { data: profile } = useSupabaseFetch<Profile | null>(
    async (client) => {
      if (!user) return null;
      const { data } = await client
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data ?? null;
    },
    [user],
    { enabled: !!user, initialData: null },
  );

  return { user, profile: profile ?? null, loading };
}
