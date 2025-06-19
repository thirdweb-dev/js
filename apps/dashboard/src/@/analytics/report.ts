import posthog from "posthog-js";

import type { Team } from "../api/team";

// ----------------------------
// CONTRACTS
// ----------------------------

/**
 * ### Why do we need to report this event?
 * - To track the number of contracts deployed
 * - To track the number of contracts deployed on each chain
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
