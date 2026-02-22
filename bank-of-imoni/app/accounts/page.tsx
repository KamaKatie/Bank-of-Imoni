"use client";

import UserSpendingChartByCategory from "@/components/accounts/user-spending-chart";
import DashboardAccounts from "@/components/dashboard/dashboard-accounts";

export default function AccountsPage() {
  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      <div className="lg:border-r p-4 lg:overflow-y-auto">
        <DashboardAccounts />
      </div>
      <main className="p-4">
        <UserSpendingChartByCategory />
      </main>
    </div>
  );
}
