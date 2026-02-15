"use client";

import { BalanceCard } from "@/components/balance-card";
import { useAccounts } from "@/hooks/use-accounts";
import { slugify } from "@/lib/slugify";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accounts } = useAccounts();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full justify-center gap-4 overflow-x-auto p-4">
        {accounts.map((account) => (
          <BalanceCard
            key={account.id}
            accountId={account.id}
            label={account.name}
            link={`/accounts/${slugify(account.name)}-${account.id}`}
            balance={account.current_balance}
            logoSrc={account.icon || account.placeholder_img}
            className="from-green-100 to-white text-black"
            showDate
          />
        ))}
      </div>

      <main className="p-4">{children}</main>
    </div>
  );
}
