import Accounts from "@/components/dashboard-accounts";
import { Card } from "@/components/ui/card";
import SpendingChart from "@/components/dashboard-spending-chart";
import ChartPieDonutText from "@/components/dashboard-piechart";

export default function page() {
  return (
    <>
      <div className="h-full grid grid-cols-1 gap-5 last:p-5 lg:grid-cols-4">
        <div className="lg:row-span-2 flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Accounts</h3>
          <Accounts />
        </div>
        <Card className="lg:col-span-3 rounded-xl flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Cashflow</h3>
          <SpendingChart />
        </Card>

        <Card className="rounded-xl flex items-center flex-col justify-center">
          <h3 className="text-center font-semibold p-2">Recent transactions</h3>
        </Card>

        <Card className="rounded-xl flex items-center flex-col justify-center">
          <h3 className="text-center font-semibold p-2">Upcoming bills</h3>
        </Card>

        <Card className="rounded-xl flex-col items-center justify-center">
          <h3 className="text-center font-semibold p-2">Spending</h3>
          <ChartPieDonutText />
        </Card>
      </div>
    </>
  );
}
