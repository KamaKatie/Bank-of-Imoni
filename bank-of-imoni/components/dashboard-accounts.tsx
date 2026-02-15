"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccounts } from "@/hooks/use-accounts";
import { slugify } from "@/lib/slugify";
import { useWorkingBalance } from "@/hooks/use-working-balance";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Badge } from "./ui/badge";
import { BalanceCard } from "./balance-card";

export default function DashboardAccounts() {
  const { accounts, workingBalance } = useAccounts();

  return (
    <div className="gap-10 w-full md:bg-white bg-emerald-700 md:gap-0 md:space-y-4 flex md:flex-col items-center justify-center">
      <div className="flex flex-col">
        <h1 className="text-white md:text-black text-center pb-4 font-semibold text-md">
          Accounts
        </h1>

        {/*Balance Card */}
        <BalanceCard
          link="/accounts"
          label="Working Balance"
          balance={workingBalance}
          className="from-green-100 to-white hover:scale-105 duration-150"
          showDate
        />
      </div>

      {/*Accounts */}
      <ul>
        {accounts.map((account) => (
          <AccountItem key={account.id || account.name} account={account} />
        ))}
      </ul>
    </div>
  );
}

// Create a separate component for each account to use the hook
function AccountItem({ account }: { account: any }) {
  const { balance, isLoading } = useWorkingBalance(account.id);

  return (
    <li className="my-2">
      <Item
        className="rounded-xl hover:border-emerald-700 min-w-full"
        variant="muted"
        asChild
      >
        <Link href={`/accounts/${slugify(account.name)}-${account.id}`}>
          <ItemMedia variant="image" className="hidden md:flex">
            <Image
              src={account.icon || account.placeholder_img}
              alt={account.name}
              width={500}
              height={500}
            />
          </ItemMedia>

          <ItemContent>
            <div className="flex items-center justify-between gap-5">
              <ItemTitle className="md:text-inherit text-emerald-900">
                {account.name}
              </ItemTitle>

              <Badge variant="outline" className="bg-white hidden md:flex">
                {account.type}
              </Badge>
            </div>

            <ItemDescription className="text-emerald-50 md:text-inherit">
              {isLoading ? "Loading..." : `¥${balance?.toLocaleString() ?? 0}`}
            </ItemDescription>
          </ItemContent>
        </Link>
      </Item>
    </li>
  );
}
