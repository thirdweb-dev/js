export function getTokenDeploymentTrackingData(
  params: {
    chainId: number;
  } & (
    | {
        type: "attempt" | "success";
      }
    | {
        type: "error";
        errorMessage: string;
      }
  ),
) {
  // using "custom-contract" because it has to match the main deployment tracking format
  return {
    category: "custom-contract",
    action: "deploy",
    label: params.type,
    publisherAndContractName: "deployer.thirdweb.eth/ERC20Asset",
    chainId: params.chainId,
    deploymentType: "asset",
  };
}

// example: asset.claim-conditions.attempt
export function getTokenStepTrackingData(
  params: {
    action: "claim-conditions" | "airdrop" | "mint" | "deploy";
    chainId: number;
  } & (
    | {
        status: "attempt" | "success";
      }
    | {
        status: "error";
        errorMessage: string;
      }
  ),
) {
  return {
    category: "asset",
    action: params.action,
    contractType: "ERC20Asset",
    label: params.status,
    chainId: params.chainId,
    ...(params.status === "error"
      ? {
          errorMessage: params.errorMessage,
        }
      : {}),
  };
}

// example: asset.launch.attempt
export function getTokenLaunchTrackingData(
  params: {
    chainId: number;
    airdropEnabled: boolean;
    saleMode: "disabled" | "direct-sale" | "public-market";
  } & (
    | {
        type: "attempt" | "success";
      }
    | {
        type: "error";
        errorMessage: string;
      }
  ),
) {
  return {
    category: "asset",
    action: "launch",
    label: params.type,
    contractType: "ERC20Asset",
    chainId: params.chainId,
    airdropEnabled: params.airdropEnabled,
    saleMode: params.saleMode,
    ...(params.type === "error"
      ? {
          errorMessage: params.errorMessage,
        }
      : {}),
  };
}

// example: asset.info-page.next-click
export function getStepCardTrackingData(params: {
  step: string;
  click: "prev" | "next";
  contractType: "ERC20Asset" | "NFTCollection";
}) {
  return {
    category: "asset",
    action: `${params.step}-page`,
    label: `${params.click}-click`,
    contractType: params.contractType,
  };
}
