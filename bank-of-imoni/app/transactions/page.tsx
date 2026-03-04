"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTransactions from "@/hooks/use-transactions";
import { Toaster } from "@/components/ui/sonner";

export default function Page() {
  const { transactions } = useTransactions();

  return (
    <>
      <Toaster position="top-center"/>
      <div className="flex flex-col p-5 h-full w-full">
        <DataTable columns={columns} data={transactions} />
      </div>
    </>
  );
}
