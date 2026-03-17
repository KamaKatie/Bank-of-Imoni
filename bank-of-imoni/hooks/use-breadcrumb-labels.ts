"use client";

import { useState, useEffect, useRef } from "react";

export function useBreadcrumbLabels(segments: string[]) {
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>(
    {},
  );

  // Use a ref to track IDs we have already attempted to fetch.
  // This prevents re-fetching 404s or repeating successful fetches.
  const fetchedIds = useRef<Set<string>>(new Set());

  // Regex to detect if a segment is a pure number or a UUID
  const isTechnicalId = (segment: string) => {
    // If it's a Vercel placeholder or empty, skip it
    if (!segment || segment.startsWith("%")) return false;

    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return /^[0-9]+$/.test(segment) || uuidRegex.test(segment);
  };

  const formatSlug = (slug: string) =>
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    const fetchMissingLabels = async () => {
      const newLabels: Record<string, string> = {};
      let hasUpdates = false;

      for (const segment of segments) {
        // Only fetch if it's a technical ID, we haven't fetched it yet,
        // and it's not already in our state.
        if (
          isTechnicalId(segment) &&
          !dynamicLabels[segment] &&
          !fetchedIds.current.has(segment)
        ) {
          // Mark as "attempted" immediately to block concurrent loops
          fetchedIds.current.add(segment);

          try {
            const res = await fetch(`/api/lookup/${segment}`);

            if (res.ok) {
              const data = await res.json();
              if (data.title) {
                newLabels[segment] = data.title;
                hasUpdates = true;
              }
            } else {
              // If 404 or other error, fallback to "Details"
              newLabels[segment] = "Details";
              hasUpdates = true;
            }
          } catch (error) {
            console.error(`Failed to lookup label for ${segment}:`, error);
            newLabels[segment] = "Details";
            hasUpdates = true;
          }
        }
      }

      if (hasUpdates) {
        setDynamicLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    fetchMissingLabels();

    // dependency array intentionally excludes dynamicLabels to prevent loops
  }, [segments]);

  const getLabel = (segment: string) => {
    // 1. Check if we have a dynamic name (from the API)
    if (dynamicLabels[segment]) return dynamicLabels[segment];

    // 2. If it's a UUID but not fetched yet, show a placeholder
    if (isTechnicalId(segment)) return "Loading...";

    // 3. Fallback to standard slug formatting (e.g., "add-transaction" -> "Add Transaction")
    return formatSlug(segment);
  };

  return { getLabel };
}
