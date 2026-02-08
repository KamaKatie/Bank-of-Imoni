"use client";

import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTransactions from "@/hooks/use-transactions";

export default function Page() {
  const data = useTransactions();

  return (
    <div className="container mx-auto">
      <h3 className="p-3 font-semibold text-lg text-center">Transactions</h3>
      <Suspense>
        <DataTable columns={columns} data={data.transactions} />
      </Suspense>
    </div>
  );
}
