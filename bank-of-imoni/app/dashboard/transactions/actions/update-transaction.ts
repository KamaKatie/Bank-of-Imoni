"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  date: z.date(),
  paidByAccountId: z.string(),
  participantUserIds: z.array(z.string()),
});

export async function updateTransaction(formData: unknown) {
  const parsed = schema.parse(formData);
  const supabase = await createClient();

  // 1. Update transaction
  const { error } = await supabase
    .from("transactions")
    .update({
      amount: parsed.amount,
      description: parsed.description,
      category: parsed.category,
      date: parsed.date,
      paid_by_account: parsed.paidByAccountId,
    })
    .eq("id", parsed.id);

  if (error) throw error;

  // 2. Delete old participants
  await supabase
    .from("transaction_participants")
    .delete()
    .eq("transaction_id", parsed.id);

  // 3. Reinsert participants
  const share = parsed.amount / parsed.participantUserIds.length;

  const participants = parsed.participantUserIds.map((id) => ({
    transaction_id: parsed.id,
    user_id: id,
    share_amount: share,
  }));

  const { error: pError } = await supabase
    .from("transaction_participants")
    .insert(participants);

  if (pError) throw pError;
}
