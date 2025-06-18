import posthog from "posthog-js";

import type { Team } from "../api/team";

// ----------------------------
// CONTRACTS
// ----------------------------

/**
 * ### Why do we need to report this event?
 * - To track the number of contracts deployed
 * - To track the number of contracts deployed on each chain
 * - To track if the contract was deployed on the asset page vs on the deploy page
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportContractDeployed(properties: {
  address: string;
  chainId: number;
  publisher: string | undefined;
  contractName: string | undefined;
  deploymentType?: "asset";
}) {
  posthog.capture("contract deployed", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track the number of contracts that failed to deploy
 * - To track the error message of the failed contract deployment (so we can fix it / add workarounds)
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportContractDeployFailed(properties: {
  errorMessage: string;
}) {
  posthog.capture("contract deploy failed", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track the number of contracts published
 * - To understand the type of contracts published
 * - To understand who publishes contracts
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportContractPublished(properties: {
  publisher: string;
  contractName: string;
  version: string;
  deployType: string | undefined;
}) {
  posthog.capture("contract published", properties);
}

// ----------------------------
// ONBOARDING (TEAM)
// ----------------------------

/**
 * ### Why do we need to report this event?
 * - To track the number of teams that enter the onboarding flow
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingStarted() {
  posthog.capture("onboarding started");
}

/**
 * ### Why do we need to report this event?
 * - To track the number of teams that select a paid plan during onboarding
 * - To know **which** plan was selected
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingPlanSelected(properties: {
  plan: Team["billingPlan"];
}) {
  posthog.capture("onboarding plan selected", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track the number of teams that skip the plan-selection step during onboarding
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingPlanSelectionSkipped() {
  posthog.capture("onboarding plan selection skipped");
}

/**
 * ### Why do we need to report this event?
 * - To track the number of teams that invite members during onboarding
 * - To track **how many** members were invited
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingMembersInvited(properties: {
  count: number;
}) {
  posthog.capture("onboarding members invited", {
    count: properties.count,
  });
}

/**
 * ### Why do we need to report this event?
 * - To track the number of teams that skip inviting members during onboarding
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingMembersSkipped() {
  posthog.capture("onboarding members skipped");
}

/**
 * ### Why do we need to report this event?
 * - To track how many teams click the upsell (upgrade) button on the member-invite step during onboarding
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingMembersUpsellButtonClicked() {
  posthog.capture("onboarding members upsell clicked");
}

/**
 * ### Why do we need to report this event?
 * - To track which plan is selected from the members-step upsell during onboarding
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingMembersUpsellPlanSelected(properties: {
  plan: Team["billingPlan"];
}) {
  posthog.capture("onboarding members upsell plan selected", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track the number of teams that completed onboarding
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportOnboardingCompleted() {
  posthog.capture("onboarding completed");
}

// ----------------------------
// FAUCET
// ----------------------------
/**
 * ### Why do we need to report this event?
 * - To track which chain the faucet was used on
 * - To track how popular specific faucets are
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportFaucetUsed(properties: {
  chainId: number;
}) {
  posthog.capture("faucet used", {
    chainId: properties.chainId,
  });
}
// ----------------------------
// CHAIN CONFIGURATION
// ----------------------------
/**
 * ### Why do we need to report this event?
 * - To track which custom chains customers are adding that we may want to add to the app
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportChainConfigurationAdded(properties: {
  chainId: number;
  chainName: string;
  rpcURLs: readonly string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}) {
  posthog.capture("chain configuration added", {
    chainId: properties.chainId,
    chainName: properties.chainName,
    rpcURLs: properties.rpcURLs,
    nativeCurrency: properties.nativeCurrency,
  });
}

// ----------------------------
// ASSETS
// ----------------------------

type StatusWithError =
  | {
      status: "successful" | "attempted";
    }
  | {
      status: "failed";
      error: string;
    };

type AssetContractType = "DropERC20" | "DropERC1155" | "DropERC721";

/**
 * ### Why do we need to report this event?
 * - To track asset buy statuses (successful, failed, attempted) in the new asset pages
 *
 * ### Who is responsible for this event?
 * @MananTank
 *
 */
export function reportAssetBuy(
  properties: {
    chainId: number;
    assetType: "NFT" | "Coin";
    contractType: AssetContractType;
  } & StatusWithError,
) {
  // Example: asset buy NFT successful
  posthog.capture(`asset buy ${properties.assetType} ${properties.status}`, {
    chainId: properties.chainId,
    contractType: properties.contractType,
    ...(properties.status === "failed" && {
      error: properties.error,
    }),
  });
}

/**
 * ### Why do we need to report this event?
 * - To track the CTA card clicks on the assets page
 *
 * ### Who is responsible for this event?
 * @MananTank
 *
 */
export function reportAssetsPageCardClick(properties: {
  label: "create-nft-collection" | "import-asset" | "create-coin";
}) {
  // Example: asset page card create-nft-collection clicked
  posthog.capture(`assets page card ${properties.label} clicked`);
}

/**
 * ### Why do we need to report this event?
 * - To track the steps that users are going through in asset creation flow
 *
 * ### Who is responsible for this event?
 * @MananTank
 *
 */
export function reportCreateAssetStepNextClicked(
  properties:
    | {
        assetType: "NFT";
        page: "collection-info" | "upload-assets" | "sales-settings";
      }
    | {
        assetType: "Coin";
        page: "coin-info" | "token-distribution" | "launch-coin";
      },
) {
  // Example: create asset NFT collection-info next clicked
  posthog.capture(
    `create asset ${properties.assetType} ${properties.page} next clicked`,
  );
}

/**
 * ### Why do we need to report this event?
 * - To track the status of each step of the create asset flow
 *
 * ### Who is responsible for this event?
 * @MananTank
 *
 */
export function reportCreateAssetStepStatus(
  properties: (
    | {
        assetType: "NFT";
        step: "deploy-contract" | "lazy-mint-nfts" | "set-claim-conditions";
      }
    | {
        assetType: "Coin";
        step:
          | "deploy-contract"
          | "set-claim-conditions"
          | "mint-tokens"
          | "airdrop-tokens";
      }
  ) &
    StatusWithError & {
      contractType: AssetContractType;
    },
) {
  // Example: create asset NFT deploy-contract successful
  posthog.capture(
    `create asset ${properties.assetType} ${properties.step} ${properties.status}`,
    {
      ...(properties.status === "failed" && {
        error: properties.error,
      }),
      contractType: properties.contractType,
    },
  );
}

/**
 * ### Why do we need to report this event?
 * - To track the status of create asset as a whole (successful, failed, attempted)
 *
 * ### Who is responsible for this event?
 * @MananTank
 *
 */
export function reportCreateAssetStatus(
  properties: {
    assetType: "NFT" | "Coin";
    contractType: AssetContractType;
  } & StatusWithError,
) {
  // Example: create asset NFT successful
  posthog.capture(`create asset ${properties.assetType} ${properties.status}`, {
    ...(properties.status === "failed" && {
      error: properties.error,
    }),
    contractType: properties.contractType,
  });
}
