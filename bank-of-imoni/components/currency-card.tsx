import { JP, US, NZ } from "country-flag-icons/react/3x2";

type Props = {
  rates: {
    NZD: number;
    USD: number;
    JPY: number;
  };
  updated: string;
};

export default function CurrencyCard({ rates, updated }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-rows-3 gap-1 text-center items-center justify-center">
        <div className="flex gap-2 items-center">
          <JP title="Japan" className="w-4 drop-shadow-md" />
          <p className="text-xs text-muted-foreground">JPY</p>
          <p className="text-sm font-semibold">¥{rates.JPY.toFixed(2)}</p>
        </div>

        <div className="flex gap-2 items-center">
          <US title="United States" className="w-4" />
          <p className="text-xs text-muted-foreground">USD</p>
          <p className="text-sm font-semibold">$1.00</p>
        </div>

        <div className="flex gap-2 items-center">
          <NZ title="New Zealand" className="w-4" />
          <p className="text-xs text-muted-foreground">NZD</p>
          <p className="text-sm font-semibold">${rates.NZD.toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t pt-3 text-center text-xs text-muted-foreground">
        Latest update: {updated}
      </div>
    </div>
  );
}
