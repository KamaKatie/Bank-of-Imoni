"use client";

import { usePathname } from "next/navigation";
import { BalanceCard } from "@/components/balance-card";
import { useAccounts } from "@/hooks/use-accounts";
import { slugify } from "@/lib/slugify";

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
                logoSrc={account.icon || account.placeholder_img}
                showDate
                className={`
                from-green-100 to-white text-black
                hover:scale-105 duration-150
                ${isActive ? "from-emerald-700 to-green-100 text-white" : ""}
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
