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
  groupId: string;
  accounts: { id: string; name: string }[];
  users: { id: string; first_name: string }[];
};

export function TransactionDialog({ groupId, accounts, users }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <TransactionForm groupId={groupId} accounts={accounts} users={users} />
      </DialogContent>
    </Dialog>
  );
}
