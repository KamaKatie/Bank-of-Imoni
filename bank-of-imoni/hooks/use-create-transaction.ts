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
      amount,
      description,
      paidByAccount,
      participants,
    }: {
      amount: number;
      description: string;
      paidByAccount: string;
      participants: Participant[];
    }) => {
      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert({
          amount,
          description,
          paid_by_account: paidByAccount,
          type: "expense",
        })
        .select()
        .single();

      if (error) throw error;

      if (participants.length > 0) {
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
      }

      return transaction;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
