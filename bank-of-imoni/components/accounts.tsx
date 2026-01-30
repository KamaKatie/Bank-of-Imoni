"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Badge } from "./ui/badge";

type Account = {
  id: string;
  name: string | null;
  current_balance: number | null;
  type: string | null;
  icon: string;
};

export default function Accounts() {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const workingBalance = accounts.reduce((total, account) => {
    return total + (account.current_balance ?? 0);
  }, 0);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data, error } = await supabase
        .from("accounts")
        .select("id, name, current_balance, type, icon")
        .order("name", { ascending: true })
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
        <li key={account.id || account.name} className="m-2">
          {" "}
          <Item className="p-3" variant={"muted"}>
            <ItemMedia variant="image">
              <img src={account.icon} alt={account.name} />
            </ItemMedia>
            <ItemContent>
              <div className="flex items-center justify-between gap-2">
                <ItemTitle>{account.name}</ItemTitle>

                <Badge variant="outline" className="bg-white">
                  {account.type}
                </Badge>
              </div>

              <ItemDescription>¥{account.current_balance}</ItemDescription>
            </ItemContent>
          </Item>
        </li>
      ))}
      <Item>
        <ItemContent>
          <ItemDescription>Working balance:</ItemDescription>
          <ItemTitle>¥{workingBalance.toLocaleString()}</ItemTitle>{" "}
        </ItemContent>
      </Item>
    </ul>
  );
}
