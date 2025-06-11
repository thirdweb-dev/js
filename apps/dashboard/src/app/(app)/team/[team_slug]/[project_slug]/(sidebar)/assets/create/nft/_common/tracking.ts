// example: asset.claim-conditions.attempt
export function getNFTStepTrackingData(
  params: {
    action: "claim-conditions" | "lazy-mint" | "mint" | "deploy";
    ercType: "erc721" | "erc1155";
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
    contractType: params.ercType === "erc721" ? "DropERC721" : "DropERC1155",
    label: params.status,
    chainId: params.chainId,
    ...(params.status === "error"
      ? {
          errorMessage: params.errorMessage,
        }
      : {}),
  };
}

export function getNFTLaunchTrackingData(
  params: {
    chainId: number;
    ercType: "erc721" | "erc1155";
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
    contractType: "NFTCollection",
    ercType: params.ercType,
    chainId: params.chainId,
    ...(params.type === "error"
      ? {
          errorMessage: params.errorMessage,
        }
      : {}),
  };
}

export function getNFTDeploymentTrackingData(
  params: {
    chainId: number;
    ercType: "erc721" | "erc1155";
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
    publisherAndContractName:
      params.ercType === "erc721"
        ? "deployer.thirdweb.eth/DropERC721"
        : "deployer.thirdweb.eth/DropERC1155",
    chainId: params.chainId,
    deploymentType: "asset",
    ...(params.type === "error"
      ? {
          errorMessage: params.errorMessage,
        }
      : {}),
  };
}
