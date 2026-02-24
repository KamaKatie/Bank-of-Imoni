import { useSupabaseQuery } from "./use-supabase-query";

export function useWorkingBalance(accountId: string | undefined) {
  const query = useSupabaseQuery<number>(
    ["working-balance", accountId],
    async (supabase) => {
      if (!accountId) return 0;
      const { data, error } = await supabase.rpc("get_working_balance", {
        account_uuid: accountId,
      });
      if (error) throw error;
      return data ?? 0;
    },
    { enabled: !!accountId, initialData: 0 },
  );

  return {
    balance: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
