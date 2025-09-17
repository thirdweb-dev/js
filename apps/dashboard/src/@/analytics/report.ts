"use client";
import posthog from "posthog-js";

import type { Team } from "@/api/team/get-team";
import type { ProductSKU } from "../types/billing";

// ----------------------------
// CONTRACTS
// ----------------------------

/**
 * ### Why do we need to report this event?
 * - To track the number of contracts deployed
 * - To track the number of contracts deployed on each chain
 * - To track if the contract was deployed on the token page vs on the deploy page
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
  chainId: number;
  publisher: string | undefined;
  contractName: string | undefined;
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
export function reportOnboardingMembersInvited(properties: { count: number }) {
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
export function reportFaucetUsed(properties: { chainId: number }) {
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
    nativeCurrency: properties.nativeCurrency,
    rpcURLs: properties.rpcURLs,
  });
}

// ----------------------------
// ASSETS
// ----------------------------

type AssetContractType =
  | "DropERC20"
  | "DropERC1155"
  | "DropERC721"
  | "ERC20Asset";

/**
 * ### Why do we need to report this event?
 * - To track number of successful asset purchases from the token page
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
    assetType: properties.assetType,
    chainId: properties.chainId,
    contractType: properties.contractType,
  });
}

type TokenSwapParams = {
  buyTokenChainId: number;
  buyTokenAddress: string;
  sellTokenChainId: number;
  sellTokenAddress: string;
};

/**
 * ### Why do we need to report this event?
 * - To track number of successful token swaps from the token page
 * - To track which tokens are being swapped the most
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportTokenSwapSuccessful(properties: TokenSwapParams) {
  posthog.capture("token swap successful", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track number of failed token swaps from the token page
 * - To track which tokens are being swapped the most
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportTokenSwapFailed(
  properties: TokenSwapParams & {
    errorMessage: string;
  },
) {
  posthog.capture("token swap failed", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track number of cancelled token swaps from the token page
 * - To track which tokens are being swapped the most
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportTokenSwapCancelled(properties: TokenSwapParams) {
  posthog.capture("token swap cancelled", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track number of failed asset purchases from the token page
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
    assetType: properties.assetType,
    chainId: properties.chainId,
    contractType: properties.contractType,
    error: properties.error,
  });
}

// Assets Landing Page ----------------------------

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

type CoinCreationStep =
  | "erc20-asset:deploy-contract"
  | "erc20-asset:airdrop-tokens"
  | "erc20-asset:approve-airdrop-tokens"
  | "drop-erc20:deploy-contract"
  | "drop-erc20:set-claim-conditions"
  | "drop-erc20:mint-tokens"
  | "drop-erc20:airdrop-tokens";

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
        step:
          | "deploy-contract"
          | "mint-nfts"
          | "set-claim-conditions"
          | "set-admins";
      }
    | {
        assetType: "coin";
        step: CoinCreationStep;
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

type UpsellParams = {
  content: "storage-limit";
  campaign: "create-coin" | "create-nft";
  sku: Exclude<ProductSKU, null>;
};

/**
 * ### Why do we need to report this event?
 * - To track how effective the upsells are in driving users to upgrade
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportUpsellShown(properties: UpsellParams) {
  posthog.capture("upsell shown", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track how effective the upsells are in driving users to upgrade
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportUpsellClicked(properties: UpsellParams) {
  posthog.capture("upsell clicked", properties);
}

// ----------------------------
// PAYMENTS
// ----------------------------

/**
 * ### Why do we need to report this event?
 * - To track conversions on payment overview page
 *
 * ### Who is responsible for this event?
 * @samina
 */
export function reportPaymentCardClick(properties: { id: string }) {
  posthog.capture("payment card clicked", properties);
}

/**
 * ### Why do we need to report this event?
 * - To create a funnel "create payment link pageview" -> "payment link created" to understand the conversion rate
 *
 * ### Who is responsible for this event?
 * @greg
 */
export function reportPaymentLinkCreated(properties: {
  linkId: string;
  clientId: string;
}) {
  posthog.capture("payment link created", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track funnel "payment link pageview" -> "payment link buy successful" to understand the conversion rate
 *
 * ### Who is responsible for this event?
 * @greg
 */
export function reportPaymentLinkBuySuccessful() {
  posthog.capture("payment link buy successful");
}

/**
 * ### Why do we need to report this event?
 * - To track the number of failed payment link buys
 * - To track what errors users encounter when trying to buy from a payment link
 *
 * ### Who is responsible for this event?
 * @greg
 */
export function reportPaymentLinkBuyFailed(properties: {
  errorMessage: string;
}) {
  posthog.capture("payment link buy failed", properties);
}

/**
 * ### Why do we need to report this event?
 * - To create a funnel for "asset pageview" -> "asset purchase successful" to understand the conversion rate
 * - To understand which asset types are being viewed the most
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportAssetPageview(properties: {
  assetType: "nft" | "coin";
  chainId: number;
}) {
  posthog.capture("asset pageview", properties);
}

/**
 * ### Why do we need to report this event?
 * - To track the usage of fund wallet modal
 * - To create a funnel "fund wallet modal opened" -> "fund wallet buy successful" to understand the conversion rate
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportFundWalletOpened() {
  posthog.capture("fund wallet opened");
}

/**
 * ### Why do we need to report this event?
 * - To track the number of successful fund wallet buys
 * - To create a funnel "fund wallet modal opened" -> "fund wallet buy successful" to understand the conversion rate
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportFundWalletSuccessful() {
  posthog.capture("fund wallet successful");
}

/**
 * ### Why do we need to report this event?
 * - To track the number of failed fund wallet buys
 * - To track the errors that users encounter when trying to buy from a fund wallet modal
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportFundWalletFailed(params: { errorMessage: string }) {
  posthog.capture("fund wallet failed", params);
}

/**
 * ### Why do we need to report this event?
 * - To track the conversion rate of the users choosing to create a token from new flow instead of the old flow
 *
 * ### Who is responsible for this event?
 * @MananTank
 */
export function reportTokenUpsellClicked(params: {
  assetType: "nft" | "coin";
  pageType: "explore" | "deploy-contract";
}) {
  posthog.capture("token upsell clicked", params);
}

// ----------------------------
// CHAIN INFRASTRUCTURE CHECKOUT
// ----------------------------
/**
 * ### Why do we need to report this event?
 * - To record explicit user acknowledgement when proceeding to checkout without RPC
 * - To measure how often customers choose to omit RPC while purchasing Insight and/or Account Abstraction
 * - To correlate potential support issues arising from missing RPC
 *
 * ### Who is responsible for this event?
 * @jnsdls
 */
export function reportChainInfraRpcOmissionAgreed(properties: {
  chainId: number;
  frequency: "monthly" | "annual";
  includeInsight: boolean;
  includeAccountAbstraction: boolean;
}) {
  posthog.capture("chain infra checkout rpc omission agreed", properties);
}
