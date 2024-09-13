"use client";
import type { PropsWithChildren } from "react";
import type { PublishedContractWithVersion } from "../../../../components/contract-components/fetch-contracts-with-versions";
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
    <div className="py-2 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
        <DeployContractInfo
          name={props.activeVersion.name}
          displayName={props.activeVersion.displayName}
          description={props.activeVersion.description}
          logo={props.activeVersion.logo}
        />
        <div className="flex flex-col-reverse md:flex-row gap-3">
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
