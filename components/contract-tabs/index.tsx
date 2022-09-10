import { ContractCode } from "./code/ContractCode";
import { ContractPermissions } from "./permissions";
import { ContractSettings } from "./settings/shared/ContractSettings";
import { isContractWithRoles } from "@3rdweb-sdk/react";
import { useContract } from "@thirdweb-dev/react";
import { Marketplace, ValidContractInstance } from "@thirdweb-dev/sdk";
import { EmbedSetup } from "contract-ui/tabs/embed/components/embed-setup";
import React, { useMemo } from "react";

export interface ContractTab {
  title: string;
  content: JSX.Element;
}

export function useContractTabs(
  contract?: ValidContractInstance,
): ContractTab[] {
  const { contract: actualContract, data } = useContract(
    contract?.getAddress(),
  );

  return useMemo(() => {
    const tabs: ContractTab[] = [];
    if (isContractWithRoles(contract)) {
      tabs.push({
        title: "Permissions",
        content: <ContractPermissions contract={contract} />,
      });
    }
    if (contract instanceof Marketplace) {
      tabs.push({
        title: "Embed",
        content: (
          <EmbedSetup
            contract={actualContract}
            contractType={data?.contractType}
          />
        ),
      });
    }

    if (data?.contractType && actualContract) {
      tabs.push({
        title: "Code",
        content: (
          <ContractCode
            contract={actualContract}
            contractType={data.contractType}
          />
        ),
      });
    }
    tabs.push({
      title: "Settings",
      content: <ContractSettings contract={contract} />,
    });

    return tabs;
  }, [contract, actualContract, data]);
}
