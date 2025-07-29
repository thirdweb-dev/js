import { PencilIcon } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import type { PublishedContractWithVersion } from "@/components/contract-components/fetch-contracts-with-versions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModuleList } from "../[publisher]/[contract_id]/components/module-list.client";
import { DeployContractInfo } from "./contract-info";
import { DeployContractVersionSelector } from "./version-selector";

type DeployContractHeaderProps = {
  publisher: string;
  contract_id: string;
  version?: string;
  allVersions: PublishedContractWithVersion[];
  activeVersion: PublishedContractWithVersion;
  className?: string;
  accountAddress: string | undefined;
};

export function DeployContractHeader(
  props: PropsWithChildren<DeployContractHeaderProps>,
) {
  return (
    <div className={cn("space-y-4 py-8 relative", props.className)}>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <DeployContractInfo
          description={props.activeVersion.description}
          displayName={props.activeVersion.displayName}
          logo={props.activeVersion.logo}
          name={props.activeVersion.name}
        />
        <div className="flex gap-3 flex-wrap lg:absolute lg:top-8 lg:right-4">
          <DeployContractVersionSelector
            availableVersions={
              props.allVersions
                ?.map((v) => v.version)
                .filter((v) => v !== undefined) || []
            }
            version={props.activeVersion.version || "latest"}
          />
          {props.children}

          {props.accountAddress === props.activeVersion.publisher && (
            <Button
              asChild
              variant="outline"
              className="rounded-full gap-4 bg-card"
            >
              <Link
                href={`/contracts/publish/${encodeURIComponent(
                  props.activeVersion.publishMetadataUri.replace("ipfs://", ""),
                )}`}
              >
                <PencilIcon className="size-3.5 text-muted-foreground " />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>
      <ModuleList />
    </div>
  );
}
