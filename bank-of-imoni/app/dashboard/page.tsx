import AccountsList from "@/components/accounts-list";
import { UserTransactions } from "@/components/tables/recent-user-transactions";
import UserSpendingChartByCategory from "@/components/accounts/user-spending-chart";
export default function Page() {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 p-4 gap-4 items-center">
      {/* Accounts */}
      <div className="lg:col-span-3 flex flex-col items-center justify-center">
        <AccountsList />
      </div>
      <div className="lg:col-span-3 row-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4 h-fit">
        {/* Recent transactions */}
        <div className="bg-card rounded-xl border shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Recent Transactions
          </div>
          <UserTransactions />
        </div>

        {/* Upcoming bills */}
        <div className="bg-card rounded-xl border shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Upcoming Bills
          </div>
        </div>

        {/* Spending */}
        <div className="bg-card rounded-xl border shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Monthly Cashflow
          </div>
          <UserSpendingChartByCategory />
        </div>
      </div>
    </div>
  );
}
