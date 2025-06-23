import type { PropsWithChildren } from "react";
import type { PublishedContractWithVersion } from "@/components/contract-components/fetch-contracts-with-versions";
import { ModuleList } from "../[publisher]/[contract_id]/components/module-list.client";
import { DeployContractInfo } from "./contract-info";
import { DeployContractVersionSelector } from "./version-selector";

type DeployContractHeaderProps = {
  publisher: string;
  contract_id: string;
  version?: string;
  allVersions: PublishedContractWithVersion[];
  activeVersion: PublishedContractWithVersion;
};

export function DeployContractHeader(
  props: PropsWithChildren<DeployContractHeaderProps>,
) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <DeployContractInfo
          description={props.activeVersion.description}
          displayName={props.activeVersion.displayName}
          logo={props.activeVersion.logo}
          name={props.activeVersion.name}
        />
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          {
            <DeployContractVersionSelector
              availableVersions={
                props.allVersions
                  ?.map((v) => v.version)
                  .filter((v) => v !== undefined) || []
              }
              version={props.activeVersion.version || "latest"}
            />
          }
          {props.children}
        </div>
      </div>
      <ModuleList />
    </div>
  );
}
