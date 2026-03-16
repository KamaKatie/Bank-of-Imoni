"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { deleteTransaction } from "@/app/dashboard/transactions/actions/delete-transaction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type Props = {
  id: string;
  onDeleted?: () => void;
  redirectTo?: string; // Optional prop to specify where to go
};

export default function DeleteTransactionDialog({
  id,
  onDeleted,
  redirectTo,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter(); // 2. Initialize router

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteTransaction(id);
        toast.success("Transaction deleted");

        // 3. Handle Navigation and Cleanup
        setOpen(false);
        onDeleted?.();

        if (redirectTo) {
          router.push(redirectTo);
        } else {
          // Default: Go back to the dashboard/list or the previous page
          router.push("/dashboard/transactions");
          // Alternative: router.back() if you want exactly the previous page
        }
      } catch {
        toast.error("Failed to delete");
      }
    });
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-100 hover:text-red-600"
          >
            Delete
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg flex-col flex items-center justify-center">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">
              Are you sure?
            </DialogTitle>
          </DialogHeader>

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
        </DialogContent>
      </Dialog>
    </div>
  );
}
