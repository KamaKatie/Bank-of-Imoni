"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteTransaction(id: string) {
  const supabase = await createClient();

  await supabase
    .from("transaction_participants")
    .delete()
    .eq("transaction_id", id);

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) throw error;
}
