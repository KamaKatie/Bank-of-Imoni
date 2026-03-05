"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccounts } from "@/hooks/use-accounts";
import { slugify } from "@/lib/utils";
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
    <div className="gap-10 w-full md:gap-0 md:space-y-4 flex md:flex-col items-center justify-center">
      <ul>
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
    <li className="my-2">
      <Item
        className="rounded-xl drop-shadow-md md:drop-shadow-none hover:border-emerald-700 min-w-full"
        variant="muted"
        asChild
      >
        <Link
          href={`/dashboard/accounts/${slugify(account.name)}-${account.id}`}
        >
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
              <ItemTitle className="md:text-inherit text-emerald-700">
                {account.name}
              </ItemTitle>

              <Badge variant="outline" className="bg-white hidden md:flex">
                {account.type}
              </Badge>
            </div>

            <ItemDescription className="text-inherit">
              {isLoading ? "Loading..." : `¥${balance?.toLocaleString() ?? 0}`}
            </ItemDescription>
          </ItemContent>
        </Link>
      </Item>
    </li>
  );
}
