"use client";

import AccountsList from "@/components/accounts-list";
import CashflowChart from "@/components/cashflow-chart";
import { Card } from "@/components/ui/card";

export default function AccountsPage() {
  return (
    <div className="h-full flex flex-col md:flex overflow-hidden p-4 gap-4">
        <AccountsList />
      <main className="flex-1 w-full">
        <Card className="flex flex-col items-center justify-center w-full p-5">
          <h2 className="text-lg font-semibold">Cashflow</h2>
          <CashflowChart />
        </Card>
      </main>
    </div>
  );
}
