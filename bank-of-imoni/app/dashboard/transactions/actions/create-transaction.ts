"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  date: z.coerce.date(),
  paidByAccountId: z.string(),
  splitType: z.enum(["equal", "full", "none"]),
  type: z.string(),
});

export async function createTransaction(formData: unknown) {
  const parsed = schema.parse(formData);
  const supabase = await createClient();

  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert({
      amount: parsed.amount,
      description: parsed.description,
      category: parsed.category,
      date: parsed.date,
      paid_by_account: parsed.paidByAccountId,
      split_type: parsed.splitType,
      type: parsed.type,
    })
    .select()
    .single();

  if (error) throw error;

  return transaction;
}
