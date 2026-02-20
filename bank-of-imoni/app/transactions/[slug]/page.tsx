"use client";

import useTransactions from "@/hooks/use-transactions";
import { useParams } from "next/navigation";
import { slugify } from "@/lib/utils";
import AsciiCat from "@/components/transactions/ascii-cat-generator";
import Barcode from "react-barcode";
import Image from "next/image";
import { DynamicIcon } from "lucide-react/dynamic";
import { Spinner } from "@/components/ui/spinner";
import EditTransactionDialog from "@/components/transactions/edit-transaction-dialog";
import DeleteTransactionDialog from "@/components/transactions/delete-transaction-dialog";

export default function Page() {
  const params = useParams();
  const { transactions, transactionParticipants, accounts, users, categories } =
    useTransactions();

  const transaction = transactions.find(
    (transaction) => params.slug === transaction.id,
  );

  if (!transaction) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-muted">
        <Spinner />
      </div>
    );
  }

  const refresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full items-center justify-center bg-muted">
      <div className="drop-shadow-lg max-w-[400px] w-full text-center p-5 bg-white">
        <h1 className="pb-3 font-bold">BANK OF IMONI</h1>
        <AsciiCat />
        <h1 className="p-3 text-xs">ID: {slugify(transaction.id)}</h1>
        <h2 className="border-dashed border-y-2 border-slate-400 py-3 text-sm uppercase">
          {transaction.type} reciept
        </h2>

        <div className="flex flex-col justify-center max-w-[400px] mx-auto font-light">
          <div className="my-8 p-2">
            <div className="flex justify-between">
              <span className="font-medium text-left">Vendor:</span>
              <span className="text-right">{transaction.description}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-left">Date:</span>
              <span className="text-right">
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-left">Category:</span>
              <span className="text-right flex gap-2 items-center">
                {transaction.categories?.name}
                <DynamicIcon
                  name={(transaction.categories?.icon || "help-circle") as any}
                  size={15}
                  strokeWidth={1}
                />
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-left">Account:</span>
              <span className="text-right flex gap-2 items-center">
                {transaction.accounts?.name}
                <Image
                  src={
                    transaction.accounts!.icon ||
                    transaction.accounts!.placeholder_img
                  }
                  alt={transaction.accounts!.name || "Account"}
                  width={100}
                  height={100}
                  className="rounded-full w-5 h-5"
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-left">Shared:</span>
              <span className="text-right">
                {transactionParticipants?.length > 1 ? (
                  <span className="text-green-600">Yes ✓</span>
                ) : (
                  <span>No</span>
                )}
              </span>
            </div>
          </div>

          <div className="border-dashed border-y-2 border-slate-400 p-3">
            <div className="flex justify-between">
              <span className="font-medium text-lg">Total Amount:</span>
              <span className="text-2xl font-bold">
                ¥{transaction.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <Barcode
            value={transaction.id}
            displayValue={false}
            width={1}
            height={50}
            className="w-full py-3"
            renderer="img"
          />
          <p>
            Paid: {transaction.accounts?.profiles?.first_name} -{" "}
            {transaction.accounts.type}
          </p>
        </div>
      </div>
      <div className="bottom-0 fixed w-full flex justify-center m-5 gap-2">
        <EditTransactionDialog
          key={transaction.id}
          transaction={transaction}
          accounts={accounts}
          users={users}
          categories={categories}
          onUpdated={refresh}
        />

        <DeleteTransactionDialog id={transaction.id} onDeleted={refresh} />
      </div>
    </div>
  );
}
