"use client";

import { useTransition } from "react";
import { deleteTransaction } from "@/app/transactions/actions/delete-transaction";
import { updateTransaction } from "@/app/transactions/actions/update-transaction";
import { toast } from "sonner";

export default function useTransactionActions(onSuccess?: () => void) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteTransaction(id);
        toast.success("Transaction deleted");
        onSuccess?.();
      } catch {
        toast.error("Failed to delete");
      }
    });
  }

  function handleUpdate(data: any) {
    startTransition(async () => {
      try {
        await updateTransaction(data);
        toast.success("Transaction updated");
        onSuccess?.();
      } catch {
        toast.error("Failed to update");
      }
    });
  }

  return { handleDelete, handleUpdate, isPending };
}
