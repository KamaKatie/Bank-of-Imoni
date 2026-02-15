import { Database } from "@/types/database.types";

type Account = Database["public"]["Tables"]["accounts"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export const calculateWorkingBalance = (
  accounts: Account[],
  transactions: Transaction[],
) => {
  const totalAccountBalance = accounts.reduce((acc, curr) => {
    return acc + Number(curr.current_balance) / 100;
  }, 0);

  return totalAccountBalance;
};

export default calculateWorkingBalance;
