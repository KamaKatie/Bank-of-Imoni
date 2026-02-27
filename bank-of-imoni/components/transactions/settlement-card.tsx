"use client";

import { useUserBalance } from "@/hooks/use-user-balance";

export function SettlementCard() {
  const { balance, loading } = useUserBalance();

  if (loading)
    return <div className="h-12 w-48 animate-pulse bg-muted rounded-xl" />;

  const isSettled = Math.abs(balance) < 0.01;
  const iAmOwed = balance > 0;
  const absoluteBalance = Math.abs(balance).toLocaleString();

  return (
    <div
      className={`px-4 py-2 w-max flex items-center justify-center rounded-full border transition-colors ${
        isSettled
          ? "bg-zinc-900 border-zinc-800"
          : iAmOwed
            ? "bg-emerald-300/10 border-emerald-300/20"
            : "bg-red-300/10 border-red-300/20"
      }`}
    >
      <p
        className={`text-sm font-bold ${
          isSettled
            ? "text-zinc-400"
            : iAmOwed
              ? "text-emerald-600"
              : "text-red-600"
        }`}
      >
        {isSettled
          ? "You're all settled up!"
          : iAmOwed
            ? "You're owed "
            : "You owe "}

        {!isSettled && `¥${absoluteBalance}`}
      </p>
    </div>
  );
}
