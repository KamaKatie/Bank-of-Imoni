"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  groupId: z.string(),
  amount: z.number(),
  description: z.string(),
  paidByAccountId: z.string(),
  participantUserIds: z.array(z.string()),
});

export async function createTransaction(formData: unknown) {
  const parsed = schema.parse(formData);
  const supabase = createClient();

  // 1. Insert transaction
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert({
      group_id: parsed.groupId,
      amount: parsed.amount,
      description: parsed.description,
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
