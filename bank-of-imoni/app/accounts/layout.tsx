"use client";

import { usePathname } from "next/navigation";
import { BalanceCard } from "@/components/balance-card";
import { useAccounts } from "@/hooks/use-accounts";
import { slugify } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accounts } = useAccounts();
  const pathname = usePathname();

  return (
    <div className="h-full flex overflow-hidden">
      <div className="border-r p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {accounts.map((account) => {
            const link = `/accounts/${slugify(account.name)}-${account.id}`;
            const isActive = pathname.startsWith(link);

            return (
              <BalanceCard
                key={account.id}
                accountId={account.id}
                label={account.name}
                link={link}
                balance={account.current_balance}
                showDate={false}
                className={` bg-muted px-4 py-2
                ${isActive ? "from-green-100 to-yellow-100 " : ""}
              `}
              />
            );
          })}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
