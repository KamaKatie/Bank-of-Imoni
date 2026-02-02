"use client";

import { useAccounts } from "@/hooks/use-accounts";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

export default function Accounts() {
  const { accounts, workingBalance, loading } = useAccounts();

  if (loading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <ul>
      {accounts.map((account) => (
        <li key={account.id || account.name} className="my-2">
          {" "}
          <Item className="p-3 rounded-xl" variant={"muted"}>
            <ItemMedia variant="image">
              <Image
                src={account.icon || account.placeholder_img}
                alt={account.name}
                width={500}
                height={500}
              />
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
