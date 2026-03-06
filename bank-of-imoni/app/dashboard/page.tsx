import AccountsList from "@/components/accounts-list";
import { Card } from "@/components/ui/card";
import { UserTransactions } from "@/components/tables/recent-user-transactions";
import UserSpendingChartByCategory from "@/components/accounts/user-spending-chart";
export default function Page() {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 p-4 gap-4">
      {/* Accounts */}
      <div className="lg:col-span-3 flex flex-col items-center justify-center">
        <AccountsList />
      </div>
      <div className="lg:col-span-3 row-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        {/* Recent transactions */}
        <Card className="rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Recent transactions</h3>
          <UserTransactions />
        </Card>

        {/* Upcoming bills */}
        <Card className="rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Upcoming bills</h3>
        </Card>

        {/* Spending */}
        <Card className="rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Monthly Spending</h3>
          <UserSpendingChartByCategory />
        </Card>
      </div>
    </div>
  );
}
