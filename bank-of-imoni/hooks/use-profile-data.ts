export const fetchFullProfile = async (supabase: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      image,
      accounts (current_balance),
      goals (id)
    `)
    .eq('id', user.id)
    .single();

  if (error) throw error;

  const totalBalance = data.accounts?.reduce((sum: number, acc: any) => 
    sum + Number(acc.current_balance || 0), 0) || 0;

  return {
    ...data,
    totalBalance,
    goalCount: data.goals?.length || 0
  };
};