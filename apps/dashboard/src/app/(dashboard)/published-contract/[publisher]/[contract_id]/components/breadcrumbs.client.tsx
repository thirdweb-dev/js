"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { isAddress } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";

export function PublishedContractBreadcrumbs() {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb className="py-4 px-6 border-b border-border">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink aria-label="Explore" asChild>
            <Link href="/explore">Explore</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const renderedSegment = isAddress(segment)
            ? shortenAddress(segment)
            : segment;

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{renderedSegment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild aria-label={segment}>
                    <Link href={href}>{renderedSegment}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
