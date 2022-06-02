import { ContractCode } from "./code/ContractCode";
import { WidgetSetup } from "./embeds";
import { ContractPermissions } from "./permissions";
import { DropPhases } from "./phases/DropPhases";
import { ContractSettings } from "./settings/shared/ContractSettings";
import { isContractWithRoles, useIsAdmin } from "@3rdweb-sdk/react";
import {
  EditionDrop,
  Marketplace,
  NFTDrop,
  TokenDrop,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import React, { useMemo } from "react";

export interface ContractTab {
  title: string;
  content: JSX.Element;
}

export function useContractTabs(
  contract?: ValidContractInstance,
): ContractTab[] {
  const isAdmin = useIsAdmin(contract);
  return useMemo(() => {
    const tabs: ContractTab[] = [];
    if (isContractWithRoles(contract)) {
      tabs.push({
        title: "Permissions",
        content: <ContractPermissions contract={contract} />,
      });
    }

    if (
      (contract instanceof NFTDrop || contract instanceof TokenDrop) &&
      isAdmin
    ) {
      tabs.push({
        title: "Claim Phases",
        content: <DropPhases contract={contract} />,
      });
    }
    if (
      contract instanceof NFTDrop ||
      contract instanceof EditionDrop ||
      contract instanceof Marketplace ||
      contract instanceof TokenDrop
    ) {
      tabs.push({
        title: "Embed",
        content: <WidgetSetup contract={contract} />,
      });
    }

    tabs.push({
      title: "Code",
      content: <ContractCode contract={contract} />,
    });
    tabs.push({
      title: "Settings",
      content: <ContractSettings contract={contract} />,
    });

    return tabs;
  }, [contract, isAdmin]);
}
