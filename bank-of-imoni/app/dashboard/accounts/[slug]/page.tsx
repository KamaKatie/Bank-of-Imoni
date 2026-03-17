"use client";

import Image from "next/image";
import LoadingPage from "@/components/loading-page";
import { useParams } from "next/navigation";
import { useAccounts } from "@/hooks/use-accounts";
import { useCashflow } from "@/hooks/use-cashflow";
import { useWorkingBalance } from "@/hooks/use-working-balance";
import AccountsLineChart from "@/components/accounts/accounts-spending-chart";
import { AccountTransactionsTable } from "@/components/accounts/account-transactions-table";

export default function AccountPage() {
  const { accounts, loading } = useAccounts();
  const params = useParams();
  const slugParam = params.slug as string;

  const account = accounts.find((acc) => slugParam === `${acc.id}`);

  const { data: cashflow } = useCashflow(account?.id);

  const { balance: workingBalance, isLoading: balanceLoading } =
    useWorkingBalance(account?.id);

  if (loading || balanceLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingPage />
      </div>
    );
  if (!account)
    return (
      <div className="p-4 text-red-600 flex h-full items-center justify-center text-lg">
        Account not found
      </div>
    );

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className=" border-b px-8 py-4 flex items-center justify-between">
        <span className="flex items-center gap-3">
          <Image
            src={account.icon || account.placeholder_img}
            alt={account.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <h1 className="text-xl tracking-tight">{account.name}</h1>
        </span>

        <p className="text-xl font-bold">¥{workingBalance?.toLocaleString()}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Charts */}
        <div className="bg-card rounded-xl border shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Cashflow
          </div>
          <div className="flex-1">
            <AccountsLineChart data={cashflow} accountName={account.name} />
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-card rounded-xl border shadow-sm flex flex-col w-full">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Recent Transactions
          </div>

          <div className="flex-1">
            <AccountTransactionsTable accountId={account.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
