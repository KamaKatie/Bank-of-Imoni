"use client";

import { useState } from "react";
import { Database } from "@/database.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { TransactionForm } from "./transaction-form";

// Helper types to make the Props definition cleaner
type Account = Database["public"]["Tables"]["accounts"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

type Props = {
  accounts: Account[];
  users: Profile[];
  categories: Category[];

  onTransactionCreated?: () => void;
  splitType?: "equal" | "full" | "none";
  type?: "expense" | "income" | "transfer";
  title?: string;
  icon?: React.ReactNode;
};

export function TransactionDialog({
  accounts,
  users,
  categories,
  onTransactionCreated,
  type = "expense",
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
            {icon} <p className="hidden lg:block"> {title} </p>
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
