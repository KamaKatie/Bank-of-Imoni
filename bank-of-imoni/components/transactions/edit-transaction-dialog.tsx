"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "./transaction-form";

type Props = {
  transaction: any;
  accounts: any[];
  users: any[];
  categories: any[];
  onUpdated?: () => void;
};

export default function EditTransactionDialog({
  transaction,
  accounts,
  users,
  categories,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
        </DialogHeader>

        <TransactionForm
          mode="edit"
          accounts={accounts}
          users={users}
          categories={categories}
          initialValues={{
            id: transaction.id,
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category,
            date: new Date(transaction.date),
            paidByAccountId: transaction.paid_by_account,
            participantUserIds:
              transaction.transaction_participants?.map(
                (p: any) => p.user_id,
              ) ?? [],
          }}
          onSuccess={() => {
            setOpen(false);
            onUpdated?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
