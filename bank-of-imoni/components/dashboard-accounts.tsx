"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccounts } from "@/hooks/use-accounts";
import { slugify } from "@/lib/slugify";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Badge } from "./ui/badge";
import { BalanceCard } from "./balance-card";

export default function Accounts() {
  const { accounts, workingBalance } = useAccounts();

  return (
    <div className="space-y-4 flex flex-col items-center">
      {/*Balance Card */}
      <BalanceCard
        link="/accounts"
        label="Working Balance"
        balance={workingBalance}
        className="from-green-100 to-white text-black min-w-[240px] hover:scale-105 duration-150"
        showDate
      />

      {/*Accounts */}
      <ul>
        {accounts.map((account) => (
          <li key={account.id || account.name} className="first:my-0 my-2">
            <Item
              className="rounded-xl hover:bg-green-50 min-w-full"
              variant="muted"
              asChild
            >
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
                  <div className="flex items-center justify-between gap-5">
                    <ItemTitle>{account.name}</ItemTitle>

                    <Badge variant="outline" className="bg-white">
                      {account.type}
                    </Badge>
                  </div>

                  <ItemDescription>
                    ¥{account.current_balance?.toLocaleString()}
                  </ItemDescription>
                </ItemContent>
              </Link>
            </Item>
          </li>
        ))}
      </ul>
    </div>
  );
}
