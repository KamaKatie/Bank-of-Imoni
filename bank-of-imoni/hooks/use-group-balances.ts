

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useGroupBalances(groupId: string) {
  return useQuery({
    queryKey: ["group", groupId, "balances"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_group_balances", {
        g_id: groupId,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });
}
