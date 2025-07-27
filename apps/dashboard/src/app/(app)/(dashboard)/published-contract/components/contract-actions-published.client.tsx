"use client";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PublishedActions(props: {
  publisher: string;
  contract_id: string;
  version?: string;
  displayName: string;
}) {
  const searchparams = useSearchParams();
  const stringifiedSearchParams = searchparams?.toString();

  return (
    <Button asChild className="gap-2 rounded-full">
      <Link
        href={`/${props.publisher}/${props.contract_id}${props.version ? `/${props.version}` : ""}/deploy${stringifiedSearchParams ? `?${stringifiedSearchParams}` : ""}`}
      >
        Deploy Now
        <ArrowUpRightIcon className="size-4" />
      </Link>
    </Button>
  );
}
