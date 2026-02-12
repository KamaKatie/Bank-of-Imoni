"use server";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";

type Participant = {
  user_id: string;
  share_amount: number;
};

export function useCreateExpense() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      amount,
      description,
      paidByAccount,
      participants,
    }: {
      groupId: string;
      amount: number;
      description: string;
      paidByAccount: string;
      participants: Participant[];
    }) => {
      // 1. Insert transaction
      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert({
          group_id: groupId,
          amount,
          description,
          paid_by_account: paidByAccount,
          type: "expense",
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Insert participants
      const { error: participantsError } = await supabase
        .from("transaction_participants")
        .insert(
          participants.map((p) => ({
            transaction_id: transaction.id,
            user_id: p.user_id,
            share_amount: p.share_amount,
          })),
        );

      if (participantsError) throw participantsError;

      return transaction;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["group", variables.groupId],
      });
    },
  });
}
