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
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { slugify } from "@/lib/slugify";

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
        <li key={account.id || account.name} className="first:my-0 my-2">
          {" "}
          <Item className="rounded-xl hover:bg-green-50" variant={"muted"} asChild>
            <Link href={`/accounts/${slugify(account.name)}-${account.id}`}>
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
            </Link>
          </Item>
        </li>
      ))}
      <div className="gap-2 text-center p-4">
        <h1 className="font-semibold text-emerald-700">Working balance:</h1>
        <p>¥{workingBalance.toLocaleString()}</p>
      </div>
    </ul>
  );
}
