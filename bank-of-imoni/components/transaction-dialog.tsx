"use client";

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
  accounts: { id: string; name: string }[];
  users: { id: string; first_name: string }[];
  categories: { id: string; name: string }[];
};

export function TransactionDialog({ accounts, users, categories }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <TransactionForm
          accounts={accounts}
          users={users}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
