"use server";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";

export function useSettle() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      fromUserId,
      toUserId,
      amount,
    }: {
      groupId: string;
      fromUserId: string;
      toUserId: string;
      amount: number;
    }) => {
      const { error } = await supabase.from("settlements").insert({
        group_id: groupId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount,
      });

      if (error) throw error;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["group", variables.groupId],
      });
    },
  });
}
