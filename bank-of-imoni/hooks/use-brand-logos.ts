// hooks/use-brand-logos.ts
"use client";

import { useState, useCallback, useEffect } from "react";

export type BrandData = {
  logo: string | null;
  name?: string;
  domain?: string;
};

// Cache for already fetched brands
const brandCache = new Map<string, BrandData>();

export function useBrandLogos() {
  const [logos, setLogos] = useState<Record<string, BrandData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Fetch logo for a single transaction
  const fetchLogoForTransaction = useCallback(
    async (
      transactionId: string,
      description: string,
    ): Promise<BrandData | null> => {
      // Skip if no description
      if (!description) return null;

      // Check cache first
      if (brandCache.has(description)) {
        const cached = brandCache.get(description)!;
        setLogos((prev) => ({ ...prev, [transactionId]: cached }));
        return cached;
      }

      setLoading((prev) => ({ ...prev, [transactionId]: true }));

      try {
        // Extract company name from description
        const companyName = description
          .split(" ")[0] // Take first word
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        if (!companyName) return null;

        // Use the Logo API (simplest approach)
        const domain = `${companyName}.com`;
        const logoUrl = `https://cdn.brandfetch.io/${domain}?c=${process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID}`;

        const brandData: BrandData = {
          logo: logoUrl,
          name: description,
          domain: domain,
        };

        // Cache it
        brandCache.set(description, brandData);
        setLogos((prev) => ({ ...prev, [transactionId]: brandData }));

        return brandData;
      } catch (err) {
        console.error("Error fetching logo:", err);
        return null;
      } finally {
        setLoading((prev) => ({ ...prev, [transactionId]: false }));
      }
    },
    [],
  );

  // Fetch logos for multiple transactions
  const fetchLogosForTransactions = useCallback(
    async (transactions: Array<{ id: string; description: string }>) => {
      const promises = transactions.map((t) =>
        fetchLogoForTransaction(t.id, t.description),
      );
      await Promise.all(promises);
    },
    [fetchLogoForTransaction],
  );

  // Get logo for a specific transaction
  const getTransactionLogo = useCallback(
    (transactionId: string): string | null => {
      return logos[transactionId]?.logo || null;
    },
    [logos],
  );

  return {
    logos,
    loading,
    fetchLogoForTransaction,
    fetchLogosForTransactions,
    getTransactionLogo,
  };
}
