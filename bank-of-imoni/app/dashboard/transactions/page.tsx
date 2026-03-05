"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTransactions from "@/hooks/use-transactions";
import { Toaster } from "@/components/ui/sonner";
import { SettlementCard } from "@/components/transactions/settlement-card";

export default function Page() {
  const { transactions } = useTransactions();

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col p-5 h-full w-full">
        <div className="md:hidden block">
          <SettlementCard />
        </div>
        <DataTable columns={columns} data={transactions} />
      </div>
    </>
  );
}
