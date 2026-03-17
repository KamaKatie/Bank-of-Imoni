"use client";

import AccountsList from "@/components/accounts-list";
import CashflowChart from "@/components/cashflow-chart";

export default function AccountsPage() {
  return (
    <div className="h-full flex flex-col md:flex overflow-hidden p-4 gap-4">
      <AccountsList />
      <main className="flex-1 w-full">
        <div className="bg-card rounded-xl border shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Cashflow
          </div>
          <CashflowChart />
        </div>
      </main>
    </div>
  );
}
