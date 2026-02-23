"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTransactions from "@/hooks/use-transactions";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { Toaster } from "@/components/ui/sonner";

export default function Page() {
  const { transactions, accounts, users, categories, refresh } =
    useTransactions();

  return (
    <>
      <Toaster />
      <div className="flex p-5 h-full w-full">
        <div className="hidden">
          <TransactionDialog
            accounts={accounts}
            users={users}
            categories={categories}
            onTransactionCreated={refresh}
          />
        </div>
        <DataTable columns={columns} data={transactions} />
      </div>
    </>
  );
}
