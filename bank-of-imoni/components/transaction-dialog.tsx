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
  accounts: {
    id: string;
    name: string;
    icon: string;
    placeholder_img: string;
  }[];
  users: { id: string; first_name: string; icon: string }[];
  categories: { id: string; name: string; icon: string }[];
};

export function TransactionDialog({ accounts, users, categories }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Add transaction</DialogTitle>
        </DialogHeader>

        <TransactionForm
          accounts={accounts}
          users={users}
          categories={categories}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
