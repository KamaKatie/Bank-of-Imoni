"use client";

import Image from "next/image";
import Link from "next/link";
import { useWorkingBalance } from "@/hooks/use-working-balance"; // Import your hook

type BalanceCardProps = {
  label?: string;
  balance: number;
  accountId?: string; // New Prop
  currency?: string;
  masked?: boolean;
  logoSrc?: string;
  expiryDate?: Date;
  showDate?: boolean;
  link?: string;
  className?: string;
};

export function BalanceCard({
  label = "Balance",
  balance,
  accountId, // Added here
  currency = "JPY",
  logoSrc,
  expiryDate = new Date(),
  showDate = false,
  link,
  className = "",
}: BalanceCardProps) {
  // 1. Fetch live balance if accountId is provided
  const { balance: liveBalance, isLoading } = useWorkingBalance(accountId);

  const expiry = expiryDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  // 2. Use liveBalance if available, otherwise fallback to the static prop
  const finalBalance = accountId && !isLoading ? liveBalance : balance;

  const displayBalance = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: currency,
  }).format(finalBalance);

  return (
    <Link href={link || ""}>
      <div
        className={`min-w-[200px] relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-md transition-all hover:scale-105 ${className}`}
      >
        <div className="flex items-start justify-between">
          <p className="text-sm opacity-80">{label}</p>

          {logoSrc && (
            <Image
              src={logoSrc}
              alt={label}
              width={20}
              height={20}
              className="rounded-full object-cover aspect-square"
            />
          )}
        </div>

        <p
          className={`mt-2 text-xl font-semibold tracking-wide ${isLoading ? "animate-pulse" : ""}`}
        >
          {displayBalance}
        </p>

        {showDate && (
          <div className="mt-2 flex items-end justify-end text-xs">
            <p className="tracking-widest">{expiry}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
