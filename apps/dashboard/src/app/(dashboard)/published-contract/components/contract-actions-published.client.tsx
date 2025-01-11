"use client";

import { Button } from "@/components/ui/button";
import { shareLink } from "@/lib/shareLink";
import { ChevronsRightIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function PublishedActions(props: {
  publisher: string;
  contract_id: string;
  version?: string;
  displayName: string;
}) {
  const searchparams = useSearchParams();
  const stringifiedSearchParams = searchparams?.toString();

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => {
          shareLink({
            title: `Deploy ${props.displayName}`,
          });
        }}
      >
        Share
      </Button>
      <Button asChild variant="primary" className="gap-2">
        <Link
          href={`/${props.publisher}/${props.contract_id}${props.version ? `/${props.version}` : ""}/deploy${stringifiedSearchParams ? `?${stringifiedSearchParams}` : ""}`}
        >
          Deploy Now
          <ChevronsRightIcon className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
