"use client";

import { CircleSlashIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb/contract";
import type { Account } from "thirdweb/wallets";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { ModuleCard } from "./module-card";
import { useAllModuleContractInfo } from "./moduleContractInfo";

export const InstalledModulesTable = (props: {
  contract: ThirdwebContract;
  installedModules: {
    data?: string[];
    isPending: boolean;
  };
  refetchModules: () => void;
  ownerAccount: Account | undefined;
  isLoggedIn: boolean;
}) => {
  const { installedModules, ownerAccount } = props;

  const allModuleContractInfo = useAllModuleContractInfo(
    installedModules.data || [],
    props.contract,
  );

  const sectionTitle = (
    <h2 className="mb-3 font-bold text-2xl tracking-tight">
      Installed Modules
    </h2>
  );

  if (!installedModules.isPending && installedModules.data?.length === 0) {
    return (
      <>
        {sectionTitle}
        <Alert variant="destructive">
          <div className="flex items-center gap-3">
            <CircleSlashIcon className="size-6 text-red-400" />
            <AlertTitle className="mb-0">No modules installed</AlertTitle>
          </div>
        </Alert>
      </>
    );
  }

  return (
    <>
      {sectionTitle}
      <ScrollShadow scrollableClassName="rounded-lg">
        <div className="flex flex-col gap-6">
          {installedModules.data?.map((moduleAddress) => (
            <ModuleCard
              allModuleContractInfo={allModuleContractInfo?.data || []}
              contract={props.contract}
              isLoggedIn={props.isLoggedIn}
              key={moduleAddress}
              moduleAddress={moduleAddress}
              onRemoveModule={props.refetchModules}
              ownerAccount={ownerAccount}
            />
          ))}
        </div>
      </ScrollShadow>
    </>
  );
};
