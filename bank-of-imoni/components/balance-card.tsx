"use client";

import Image from "next/image";

type BalanceCardProps = {
  label?: string;
  balance?: number;
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
  currency = "¥",
  masked = false,
  logoSrc,
  expiryDate = new Date(),
  showDate = false,
  link,
  className = "",
}: BalanceCardProps) {
  const expiry = expiryDate.toLocaleDateString("en-US", {
    month: "2-digit",
    year: "2-digit",
  });

  const displayBalance =
    masked || balance == null
      ? "••••••"
      : `${currency}${balance.toLocaleString()}`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-md ${className}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <p className="text-sm opacity-80">{label}</p>

        {logoSrc && (
          <Image
            src={logoSrc}
            alt={label}
            width={20}
            height={20}
            className="rounded-full"
          />
        )}
      </div>

      {/* Balance */}
      <p className="mt-3 text-2xl font-semibold tracking-wide">
        {displayBalance}
      </p>

      {/* Date (optional) */}
      {showDate && (
        <div className="mt-2 flex items-end justify-end text-xs">
          <div className="text-right">
            <p className="text-xs opacity-70">DATE:</p>
            <p className="tracking-widest">{expiry}</p>
          </div>
        </div>
      )}
    </div>
  );
}
