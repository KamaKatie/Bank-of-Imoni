"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import React, { useMemo } from "react";
import { useBreadcrumbLabels } from "@/hooks/use-breadcrumb-labels";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function Navbar() {
  const segments = useSelectedLayoutSegments();

  const cleanSegments = useMemo(() => {
    return segments.filter(
      (segment) => !segment.startsWith("(") && !segment.startsWith("@"),
    );
  }, [segments]);

  const { getLabel } = useBreadcrumbLabels(cleanSegments);

  return (
    <nav className="px-6 py-3 flex md:border-b-2 border-muted from-green-50 to-teal-50 md:bg-gradient-to-r">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {cleanSegments.map((segment, index) => {
            const isLast = index === cleanSegments.length - 1;
            const href = `/dashboard/${cleanSegments.slice(0, index + 1).join("/")}`;
            const label = getLabel(segment);

            return (
              <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
