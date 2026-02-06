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

export default function Accounts() {
  const { accounts, workingBalance } = useAccounts();

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* 💳 Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-300 p-6 text-white shadow-lg transition-transform hover:scale-[1.01]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">Working Balance</p>
            <p className="mt-1 text-3xl font-semibold">
              ¥{workingBalance?.toLocaleString()}
            </p>
          </div>

          <div className="text-right text-sm opacity-80">
            <p>{today}</p>
          </div>
        </div>

        <div className="mt-6 h-8 w-12 rounded-md bg-white/30" />
      </div>

      {/* 📋 Accounts */}
      <ul>
        {accounts.map((account) => (
          <li key={account.id || account.name} className="first:my-0 my-2">
            <Item
              className="rounded-xl hover:bg-green-50"
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
                  <div className="flex items-center justify-between gap-2">
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
