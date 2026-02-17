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
    <div>
      <div className="md:flex grid grid-cols-2 w-full justify-center gap-4 overflow-x-auto p-2">
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

      <main className="p-2">{children}</main>
    </div>
  );
}
