export function getTokenDeploymentTrackingData(
  type: "attempt" | "success" | "error",
  chainId: number,
) {
  // using "custom-contract" because it has to match the main deployment tracking format
  return {
    category: "custom-contract",
    action: "deploy",
    label: type,
    publisherAndContractName: "deployer.thirdweb.eth/DropERC20",
    chainId: chainId,
    deploymentType: "asset",
  };
}

// example: asset.claim-conditions.attempt
export function getTokenStepTrackingData(params: {
  action: "claim-conditions" | "airdrop" | "mint" | "deploy";
  chainId: number;
  status: "attempt" | "success" | "error";
}) {
  return {
    category: "asset",
    action: params.action,
    contractType: "DropERC20",
    label: params.status,
    chainId: params.chainId,
  };
}

// example: asset.launch.attempt
export function getLaunchTrackingData(params: {
  chainId: number;
  airdropEnabled: boolean;
  saleEnabled: boolean;
  type: "attempt" | "success" | "error";
}) {
  return {
    category: "asset",
    action: "launch",
    label: params.type,
    contractType: "DropERC20",
    chainId: params.chainId,
    airdropEnabled: params.airdropEnabled,
    saleEnabled: params.saleEnabled,
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
