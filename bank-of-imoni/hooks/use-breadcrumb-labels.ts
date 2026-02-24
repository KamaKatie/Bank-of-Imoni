import { useState, useEffect } from "react";

export function useBreadcrumbLabels(segments: string[]) {
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>(
    {},
  );

  const isTechnicalId = (segment: string) =>
    /^[0-9]+$/.test(segment) || /^[0-9a-fA-F-]{36}$/.test(segment);

  const formatSlug = (slug: string) =>
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    const fetchMissingLabels = async () => {
      const newLabels: Record<string, string> = {};

      for (const segment of segments) {
        if (isTechnicalId(segment) && !dynamicLabels[segment]) {
          try {
            const res = await fetch(`/api/lookup/${segment}`);
            const data = await res.json();
            newLabels[segment] = data.title;
          } catch {
            newLabels[segment] = "Details";
          }
        }
      }

      if (Object.keys(newLabels).length > 0) {
        setDynamicLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    fetchMissingLabels();
  }, [segments, dynamicLabels]);

  const getLabel = (segment: string) => {
    if (dynamicLabels[segment]) return dynamicLabels[segment];
    return formatSlug(segment);
  };

  return { getLabel };
}
