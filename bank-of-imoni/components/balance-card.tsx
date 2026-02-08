"use client";

import Image from "next/image";
import Link from "next/link";

type BalanceCardProps = {
  label?: string;
  balance: number;
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
  logoSrc,
  expiryDate = new Date(),
  showDate = false,
  link,
  className = "",
}: BalanceCardProps) {
  const expiry = expiryDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  const displayBalance = `${currency}${balance.toLocaleString()}`;

  return (
    <Link href={link || ""}>
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-md ${className}`}
      >
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

        <p className="mt-2 text-xl font-semibold tracking-wide">
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
