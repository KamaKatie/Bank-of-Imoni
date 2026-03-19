"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccounts } from "@/hooks/use-accounts";
import { useWorkingBalance } from "@/hooks/use-working-balance";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Badge } from "./ui/badge";

export default function AccountsList() {
  const { accounts } = useAccounts();

  return (
    <div className="w-full items-center justify-center">
      <ul className="w-full grid grid-cols-2 md:flex gap-2">
        {accounts.map((account) => (
          <AccountItem key={account.id || account.name} account={account} />
        ))}
      </ul>
    </div>
  );
}

function AccountItem({ account }: { account: any }) {
  const { balance, isLoading } = useWorkingBalance(account.id);

  return (
    <li className="w-full">
      <Item
        className="rounded-xl bg-emerald-700 md:bg-muted"
        variant="muted"
        asChild
      >
        <Link href={`/dashboard/accounts/${account.id}`}>
          <ItemMedia variant="image" className="h-6 w-6">
            <Image
              src={account.icon || account.placeholder_img}
              alt={account.name}
              width={500}
              height={500}
              className="rounded-full"
            />
          </ItemMedia>

          <ItemContent>
            <div className="flex items-center justify-between gap-5">
              <ItemTitle className="md:text-inherit text-green-100 text-xs">
                {account.name}
              </ItemTitle>

              <Badge variant="outline" className="bg-white hidden md:flex">
                {account.type}
              </Badge>
            </div>

            <ItemDescription className="md:text-inherit text-white text-lg md:text-base font-semibold">
              {isLoading ? "Loading..." : `¥${balance?.toLocaleString() ?? 0}`}
            </ItemDescription>
          </ItemContent>
        </Link>
      </Item>
    </li>
  );
}
