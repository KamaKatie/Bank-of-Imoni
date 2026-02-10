"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTransactions from "@/hooks/use-transactions";

export default function Page() {
  const data = useTransactions();

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data.transactions} />
    </div>
  );
}
