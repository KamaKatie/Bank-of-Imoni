"use client";

import { useParams } from "next/navigation";
import { useAccounts } from "@/hooks/use-accounts";
import { useCashflow } from "@/hooks/use-cashflow";
import { useWorkingBalance } from "@/hooks/use-working-balance";
import { slugify } from "@/lib/slugify";
import AccountsLineChart from "@/components/accounts-chart";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="p-5 grid grid-cols-3 gap-4 justify-center items-center">
      <div>
        <div className="p-4 items-center justify-between flex">
          <span className="flex items-center gap-2">
            <Image
              src={account.icon || account.placeholder_img}
              alt={account.name}
              width={30}
              height={30}
              className="rounded-full"
            />
            <h1 className="text-xl font-semibold">{account.name}</h1>
          </span>
          <p className="text-lg font-bold">
            ¥{workingBalance.toLocaleString()}
          </p>
        </div>

        {!cashflowLoading && (
          <AccountsLineChart data={cashflow} accountName={account.name} />
        )}
      </div>

      <div className="col-span-2">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <AccountTransactionsTable accountId={account.id} />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
