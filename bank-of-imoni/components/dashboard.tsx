import { Card } from "@/components/ui/card";
import Accounts from "@/components/accounts";
import ChartPieDonutText from "@/components/dashboard-piechart";

export default function Dashboard() {
  return (
    <div className="w-full max-w-7xl px-8">
      <div className="h-full grid grid-cols-3 grid-rows-2 gap-6">
        <Card className="row-span-2 rounded-xl flex-col items-center justify-center p-2">
          <h3 className="text-center font-semibold p-2">Accounts</h3>
          <Accounts />
        </Card>

        <Card className="col-span-2 rounded-xl flex items-center justify-center" />

        <Card className="rounded-xl flex items-center justify-center" />

        <Card className="rounded-xl flex items-center justify-center">
          <ChartPieDonutText />
        </Card>
      </div>
    </div>
  );
}
