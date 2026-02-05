import { JP, US, NZ } from "country-flag-icons/react/3x2";
import { Sparkline } from "@/components/fx/sparkline";

type Props = {
  rates: {
    NZD: number;
    USD: number;
    JPY: number;
  };
  history: {
    JPY: { t: string; v: number }[];
    NZD: { t: string; v: number }[];
  };
  updated: string;
};

export default function CurrencyCard({ rates, history, updated }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-rows-3 gap-1 items-center justify-center">
        <div className="flex gap-2 items-center">
          <US className="w-4" />
          <p className="text-xs text-muted-foreground">USD</p>
          <p className="text-sm font-semibold">$1.00</p>
        </div>

        <div className="flex gap-2 items-center">
          <JP className="w-4" />
          <p className="text-xs text-muted-foreground">JPY</p>
          <p className="text-sm font-semibold">¥{rates.JPY.toFixed(2)}</p>
          <Sparkline data={history.JPY} />
        </div>

        <div className="flex gap-2 items-center">
          <NZ className="w-4" />
          <p className="text-xs text-muted-foreground">NZD</p>
          <p className="text-sm font-semibold">${rates.NZD.toFixed(2)}</p>
          <Sparkline data={history.NZD} />
        </div>
      </div>

      <div className="border-t pt-3 text-center text-xs text-muted-foreground">
        Latest update: {updated}
      </div>
    </div>
  );
}
