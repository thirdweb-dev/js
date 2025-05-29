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
    publisherAndContractName: "deployer.thirdweb.eth/DropERC20",
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
    contractType: "DropERC20",
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
export function getLaunchTrackingData(
  params: {
    chainId: number;
    airdropEnabled: boolean;
    saleEnabled: boolean;
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
    contractType: "DropERC20",
    chainId: params.chainId,
    airdropEnabled: params.airdropEnabled,
    saleEnabled: params.saleEnabled,
    ...(params.type === "error"
      ? {
          errorMessage: params.errorMessage,
        }
      : {}),
  };
}

// example: asset.info-page.next-click
export function getStepCardTrackingData(params: {
  step: "info" | "distribution" | "launch";
  click: "prev" | "next";
}) {
  return {
    category: "asset",
    action: `${params.step}-page`,
    label: `${params.click}-click`,
    contractType: "DropERC20",
  };
}
