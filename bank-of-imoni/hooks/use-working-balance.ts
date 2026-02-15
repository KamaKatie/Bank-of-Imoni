import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useWorkingBalance(accountId: string | undefined) {
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["working-balance", accountId],
    queryFn: async () => {
      if (!accountId) return 0;
      const { data, error } = await supabase.rpc("get_working_balance", {
        account_uuid: accountId, // <--- Correct param name
      });
      if (error) throw error;
      return data ?? 0;
    },
    enabled: !!accountId,
    initialData: 0,
  });

  return {
    balance: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
