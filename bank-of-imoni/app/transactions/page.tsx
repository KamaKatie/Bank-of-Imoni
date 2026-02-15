"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTransactions from "@/hooks/use-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Toaster } from "@/components/ui/sonner";

export default function Page() {
  const { transactions, accounts, users, categories, refresh } =
    useTransactions();

  return (
    <>
      <Toaster />
      <div className="md:p-5 pt-5">
        <Tabs defaultValue="transactions" className="flex items-center">
          <div className="flex gap-10">
            <TransactionDialog
              accounts={accounts}
              users={users}
              categories={categories}
              onTransactionCreated={refresh}
            />
            <TabsList>
              <TabsTrigger value="transactions">All Items</TabsTrigger>
              <TabsTrigger value="shared-transactions">
                Shared Items
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="transactions">
            <DataTable columns={columns} data={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
