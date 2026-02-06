"use client";

import { BalanceCard } from "@/components/balance-card";
import { useAccounts } from "@/hooks/use-accounts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accounts, workingBalance } = useAccounts();

  return (
    <div>
      <div className="flex w-full justify-center gap-4 overflow-x-auto p-3">
        <BalanceCard
          label="Working Balance"
          balance={workingBalance}
          className="shadow-none min-w-[240px]"
        />

        {accounts.map((account) => (
          <BalanceCard
            key={account.id}
            label={account.name}
            balance={account.current_balance}
            logoSrc={account.icon || account.placeholder_img}
            className="from-green-100 to-white text-black min-w-[240px]"
            showDate
          />
        ))}
      </div>

      <main className="p-4">{children}</main>
    </div>
  );
}
