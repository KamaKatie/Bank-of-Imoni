"use client";

import UserSpendingChartByCategory from "@/components/accounts/user-spending-chart";
import DashboardAccounts from "@/components/dashboard/dashboard-accounts";

export default function AccountsPage() {
  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      <div className="md:border-r p-4 flex items-center justify-center md:overflow-y-auto">
        <DashboardAccounts />
      </div>
      <main className="p-4 flex-1">
        <UserSpendingChartByCategory />
      </main>
    </div>
  );
}
