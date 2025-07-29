"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { isAddress } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export function PublishedContractBreadcrumbs(props: { className?: string }) {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb className={cn("py-4", props.className)}>
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
                  <BreadcrumbLink aria-label={segment} asChild>
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
