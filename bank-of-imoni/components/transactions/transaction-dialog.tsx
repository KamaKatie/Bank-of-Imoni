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
  onTransactionCreated?: () => void;
  type?: "expense" | "income" | "transfer";
  title?: string;
  icon?: React.ReactNode;
};

export function TransactionDialog({
  accounts,
  users,
  categories,
  onTransactionCreated,
  type,
  title,
  icon,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onTransactionCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <span className="flex items-center gap-2">
            {icon} <p className="hidden md:block"> {title} </p>
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Add {type}</DialogTitle>
        </DialogHeader>

        <TransactionForm
          type={type}
          accounts={accounts}
          users={users}
          categories={categories}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
