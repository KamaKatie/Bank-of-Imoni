"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Item } from "./ui/item";

type Account = {
  id: string;
  name: string | null;
  current_balance: number | null;
  type: string | null;
};

export default function Accounts() {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data, error } = await supabase
        .from("accounts")
        .select("id, name, current_balance, type")
        .eq("user", auth.user.id);

      if (error) {
        console.error(error);
        return;
      }

      setAccounts(data ?? []);
    };

    fetchAccounts();
  }, [supabase]);

  return (
      <ul>
        {accounts.map((account) => (
          <Item>
          <li key={account.id}>
            {account.name}: ¥{account.current_balance} ({account.type})
          </li>
          </Item>
        ))}
      </ul>
  );
}
