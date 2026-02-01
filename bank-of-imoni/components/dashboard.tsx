import { Card } from "@/components/ui/card";
import Accounts from "@/components/dashboard-accounts";
import ChartPieDonutText from "@/components/dashboard-piechart";
import SpendingChart from "./dashboard-spending-chart";

export default function Dashboard() {
  return (
    <div
      className="
        h-full
        grid
        grid-cols-1
        gap-6
        p-5
        lg:grid-cols-3
      "
    >
      <div className="lg:row-span-2 flex-col items-center justify-center p-2">
        <h3 className="text-center font-semibold p-2">Accounts</h3>
        <Accounts />
      </div>

      <Card className="lg:col-span-2 rounded-xl flex items-center justify-center">
        <SpendingChart />
      </Card>

      <Card className="rounded-xl flex items-center justify-center" />

      <Card className="rounded-xl flex-col items-center justify-center p-2">
        <h3 className="text-center font-semibold p-2">Spending</h3>
        <ChartPieDonutText />
      </Card>
    </div>
  );
}
