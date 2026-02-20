"use client";

import { usePathname } from "next/navigation";
import { BalanceCard } from "@/components/balance-card";
import { useAccounts } from "@/hooks/use-accounts";
import { slugify } from "@/lib/utils";
import UserSpendingChartByCategory from "@/components/accounts/user-spending-chart";

export default function AccountsPage() {
  const { accounts } = useAccounts();
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      <div className="lg:border-r p-4 lg:overflow-y-auto">
        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 w-full">
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
                className={` bg-muted px-4 py-2 min-w-[100px]
                ${isActive ? "from-green-100 to-yellow-100 " : ""}
              `}
              />
            );
          })}
        </div>
      </div>{" "}
      <UserSpendingChartByCategory />
    </div>
  );
}
