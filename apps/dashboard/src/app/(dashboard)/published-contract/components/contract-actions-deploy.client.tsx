"use client";

import { Button } from "@/components/ui/button";
import { shareLink } from "@/lib/shareLink";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function DeployActions(props: {
  publisher: string;
  contract_id: string;
  version?: string;
  displayName: string;
}) {
  const searchparams = useSearchParams();

  const stringifiedSearchParams = searchparams?.toString();

  return (
    <div className="flex gap-3">
      <Button asChild variant="outline">
        <Link
          href={`/${props.publisher}/${props.contract_id}${props.version ? `/${props.version}` : ""}${stringifiedSearchParams ? `?${stringifiedSearchParams}` : ""}`}
          target="_blank"
        >
          Contract
        </Link>
      </Button>

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
    </div>
  );
}
