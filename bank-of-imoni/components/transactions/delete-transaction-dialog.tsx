"use client";

import { useState, useTransition } from "react";
import { deleteTransaction } from "@/app/transactions/actions/delete-transaction";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  id: string;
  onDeleted?: () => void;
};

export default function DeleteTransactionDialog({ id, onDeleted }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteTransaction(id);
        toast.success("Transaction deleted");
        onDeleted?.();
        setOpen(false);
      } catch {
        toast.error("Failed to delete");
      }
    });
  }

  return (
    <div>
      {!open && (
        <Button
          variant="outline"
          className="text-red-600 hover:bg-red-100 hover:text-red-600"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      )}

      {open && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>
            Are you sure you want to delete this transaction?
          </AlertTitle>

          <AlertDescription>This action cannot be undone.</AlertDescription>

          <div className="col-start-2 mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
}
