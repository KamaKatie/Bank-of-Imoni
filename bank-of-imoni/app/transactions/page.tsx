"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTransactions from "@/hooks/use-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionDialog } from "@/components/transaction-dialog";

export default function Page() {
  const data = useTransactions();

  return (
    <div className="md:p-5 pt-5">
      <TransactionDialog
        accounts={data.accounts}
        users={data.users}
        groupId={data.group_id}
      />
      <Tabs defaultValue="transactions" className="flex items-center">
        <TabsList>
          <TabsTrigger value="transactions">All Items</TabsTrigger>
          <TabsTrigger value="shared-transactions">Shared Items</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <DataTable columns={columns} data={data.transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
