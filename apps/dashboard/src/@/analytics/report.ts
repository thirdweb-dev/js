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

type AssetContractType = "DropERC20" | "DropERC1155" | "DropERC721";

/**
 * ### Why do we need to report this event?
 * - To track number of successful asset purchases from the asset page
 * - To track which asset and contract types are being purchased the most
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetBuySuccessful(properties: {
  chainId: number;
  contractType: AssetContractType;
  assetType: "nft" | "coin";
}) {
  posthog.capture("asset buy successful", {
    chainId: properties.chainId,
    contractType: properties.contractType,
    assetType: properties.assetType,
  });
}

/**
 * ### Why do we need to report this event?
 * - To track number of failed asset purchases from the asset page
 * - To track the errors that users encounter when trying to purchase an asset
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetBuyFailed(properties: {
  chainId: number;
  contractType: AssetContractType;
  assetType: "nft" | "coin";
  error: string;
}) {
  posthog.capture("asset buy failed", {
    chainId: properties.chainId,
    contractType: properties.contractType,
    assetType: properties.assetType,
    error: properties.error,
  });
}

// Assets Landing Page ----------------------------

/**
 * ### Why do we need to report this event?
 * - To track number of asset creation started from the assets page
 * - To track which asset types are being created the most
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetCreationStarted(properties: {
  assetType: "nft" | "coin";
}) {
  posthog.capture("asset creation started", {
    assetType: properties.assetType,
  });
}

/**
 * ### Why do we need to report this event?
 * - To track number of assets imported successfully from the assets page
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetImportSuccessful() {
  posthog.capture("asset import successful");
}

/**
 * ### Why do we need to report this event?
 * - To track number of asset import started in the assets page
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetImportStarted() {
  posthog.capture("asset import started");
}

/**
 * ### Why do we need to report this event?
 * - To track the steps users are configuring in the asset creation to understand if there are any drop-offs
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetCreationStepConfigured(
  properties:
    | {
        assetType: "nft";
        step: "collection-info" | "upload-assets" | "sales-settings";
      }
    | {
        assetType: "coin";
        step: "coin-info" | "token-distribution" | "launch-coin";
      },
) {
  posthog.capture("asset creation step configured", {
    assetType: properties.assetType,
    step: properties.step,
  });
}

/**
 * ### Why do we need to report this event?
 * - To track number of successful asset creations
 * - To track which asset types are being created the most
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetCreationSuccessful(properties: {
  assetType: "nft" | "coin";
  contractType: AssetContractType;
}) {
  posthog.capture("asset creation successful", {
    assetType: properties.assetType,
    contractType: properties.contractType,
  });
}

/**
 * ### Why do we need to report this event?
 * - To track number of failed asset creations
 * - To track the errors that users encounter when trying to create an asset
 * - To track the step that is failing in the asset creation
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetCreationFailed(
  properties: { contractType: AssetContractType; error: string } & (
    | {
        assetType: "nft";
        step: "deploy-contract" | "mint-nfts" | "set-claim-conditions";
      }
    | {
        assetType: "coin";
        step:
          | "deploy-contract"
          | "set-claim-conditions"
          | "mint-tokens"
          | "airdrop-tokens";
      }
  ),
) {
  posthog.capture("asset creation failed", {
    assetType: properties.assetType,
    contractType: properties.contractType,
    error: properties.error,
    step: properties.step,
  });
}
