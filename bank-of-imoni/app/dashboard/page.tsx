import Accounts from "@/components/dashboard-accounts";
import { Card } from "@/components/ui/card";
import SpendingChart from "@/components/dashboard-spending-chart";
import ChartPieDonutText from "@/components/dashboard-piechart";
import { CurrencyTracker } from "@/components/currency-tracker";

export default function Page() {
  return (
    <div className="grid h-full grid-cols-1 gap-5 p-5 lg:grid-cols-4 lg:grid-rows-2">
      {/* Row 1, Col 1 — Accounts */}
      <div>
        <h3 className="text-center font-semibold p-2">Accounts</h3>
        <Accounts />
      </div>

      {/* Row 1, Cols 2–4 — Cashflow */}
      <Card className="lg:col-span-3">
        <h3 className="text-center font-semibold p-2">Cashflow</h3>
        <SpendingChart />
      </Card>

      {/* Row 2, Col 1 — FX */}
      <div className="h-full flex flex-col justify-end">
        <CurrencyTracker />
      </div>

      {/* Row 2, Col 2 */}
      <Card>
        <h3 className="text-center font-semibold p-2">Recent transactions</h3>
      </Card>

      {/* Row 2, Col 3 */}
      <Card>
        <h3 className="text-center font-semibold p-2">Upcoming bills</h3>
      </Card>

      {/* Row 2, Col 4 */}
      <Card>
        <h3 className="text-center font-semibold p-2">Spending</h3>
        <ChartPieDonutText />
      </Card>
    </div>
  );
}
