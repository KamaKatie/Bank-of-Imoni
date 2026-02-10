import Accounts from "@/components/dashboard-accounts";
import { Card } from "@/components/ui/card";
import SpendingChart from "@/components/dashboard-spending-chart";
import ChartPieDonutText from "@/components/dashboard-piechart";
import { CurrencyTracker } from "@/components/fx/currency-tracker";

export default function Page() {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-4 place-items-stretch">
      {/* Accounts */}
      <div className="lg:row-span-2 flex flex-col items-center justify-center">
          <Accounts />
          <CurrencyTracker />
      </div>
      <div className="">
        {/* Cashflow */}
        <Card className="lg:col-span-3 rounded-xl flex flex-col">
          <h3 className="text-center font-semibold p-2">Cashflow</h3>
          <SpendingChart />
        </Card>

        {/* Recent transactions */}
        <Card className="rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Recent transactions</h3>
        </Card>

        {/* Upcoming bills */}
        <Card className="rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Upcoming bills</h3>
        </Card>

        {/* Spending */}
        <Card className="rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Spending</h3>
          <ChartPieDonutText />
        </Card>
      </div>
    </div>
  );
}
