"use client";

import { useParams } from "next/navigation";
import { useAccounts } from "@/hooks/use-accounts";
import { useCashflow } from "@/hooks/use-cashflow";
import { useWorkingBalance } from "@/hooks/use-working-balance";
import { slugify } from "@/lib/utils";
import AccountsLineChart from "@/components/accounts-chart";
import Image from "next/image";
import { AccountTransactionsTable } from "@/components/recent-transactions";

export default function AccountPage() {
  const { accounts, loading } = useAccounts();
  const params = useParams();
  const slugParam = params.slug as string;

  const account = accounts.find(
    (acc) => slugParam === `${slugify(acc.name)}-${acc.id}`,
  );

  const { data: cashflow, loading: cashflowLoading } = useCashflow(account?.id);

  const { balance: workingBalance, isLoading: balanceLoading } =
    useWorkingBalance(account?.id);

  if (loading || balanceLoading) return <div className="p-4">Loading...</div>;
  if (!account) return <div className="p-4">Account not found</div>;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b px-8 py-6 flex items-center justify-between">
        <span className="flex items-center gap-3">
          <Image
            src={account.icon || account.placeholder_img}
            alt={account.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <h1 className="text-2xl tracking-tight">{account.name}</h1>
        </span>

        <p className="text-2xl font-bold">¥{workingBalance.toLocaleString()}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="xl:col-span-2 flex flex-col">
          {!cashflowLoading && (
            <div className="flex-1 min-h-[300px]">
              <AccountsLineChart data={cashflow} accountName={account.name} />
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-card rounded-xl border shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Recent Transactions
          </div>

          <div className="flex-1">
            <AccountTransactionsTable
              accountId={account.id}
              showImage={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
