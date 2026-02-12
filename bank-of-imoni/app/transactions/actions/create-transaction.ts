"use server";

import { createClient } from "@/lib/supabase/server";
import { date, z } from "zod";

const schema = z.object({
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  date: date(),
  paidByAccountId: z.string(),
  participantUserIds: z.array(z.string()),
});

export async function createTransaction(formData: unknown) {
  const parsed = schema.parse(formData);
  const supabase = await createClient();

  // 1. Insert transaction
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert({
      amount: parsed.amount,
      description: parsed.description,
      category: parsed.category,
      date: parsed.date,
      paid_by_account: parsed.paidByAccountId,
      type: "expense",
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Equal split
  const share = parsed.amount / parsed.participantUserIds.length;

  const participants = parsed.participantUserIds.map((id) => ({
    transaction_id: transaction.id,
    user_id: id,
    share_amount: share,
  }));

  const { error: pError } = await supabase
    .from("transaction_participants")
    .insert(participants);

  if (pError) throw pError;
}
