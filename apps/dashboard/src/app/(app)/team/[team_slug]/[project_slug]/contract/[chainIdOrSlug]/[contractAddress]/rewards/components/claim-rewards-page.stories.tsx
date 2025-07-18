import type { Meta } from "@storybook/nextjs";
import { toUnits } from "thirdweb";
import { base } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";
import { storybookThirdwebClient } from "@/storybook/utils";
import { ClaimRewardsPageUI } from "./claim-rewards-page";

const meta = {
  component: ClaimRewardsPageUI,
  title: "contracts/extensions/claim-rewards",
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="container max-w-[1154px] py-10">
          <Story />
        </div>
      </ThirdwebProvider>
    ),
  ],
} satisfies Meta<typeof ClaimRewardsPageUI>;

export default meta;

const recipient = "0x8C00f3F231c88CcAc2382AaC6e09A78D4F42129d";
const referrer = "0x1Af20C6B23373350aD464700B5965CE4B0D2aD94";

function unclaimedFeesStub(token0Amount: bigint, token1Amount: bigint) {
  return {
    token0: {
      address: "0x1234567890123456789012345678901234567890",
      amount: token0Amount,
      symbol: "FOO",
    },
    token1: {
      address: "0x0987654321098765432109876543210987654321",
      amount: token1Amount,
      symbol: "BAR",
    },
  };
}

export function LargeAmounts() {
  return (
    <Variant
      token0Amount={toUnits("100000", 18)}
      token1Amount={toUnits("500000", 18)}
      includeChainExplorer
    />
  );
}

export function SmallAmounts() {
  return (
    <Variant
      token0Amount={toUnits("0.001", 18)}
      token1Amount={toUnits("0.0005", 18)}
      includeChainExplorer
    />
  );
}

export function ZeroAmount() {
  return (
    <Variant
      token0Amount={toUnits("0", 18)}
      token1Amount={toUnits("0", 18)}
      includeChainExplorer
    />
  );
}

export function ZeroAmountNoChainExplorer() {
  return (
    <Variant token0Amount={toUnits("0", 18)} token1Amount={toUnits("0", 18)} />
  );
}

function Variant(props: {
  token0Amount: bigint;
  token1Amount: bigint;
  includeChainExplorer?: boolean;
}) {
  return (
    <ClaimRewardsPageUI
      referrerBps={5000}
      chainSlug="base"
      recipient={recipient}
      referrer={referrer}
      client={storybookThirdwebClient}
      handleClaim={() => {}}
      isClaimPending={false}
      chain={base}
      unclaimedFees={unclaimedFeesStub(props.token0Amount, props.token1Amount)}
    />
  );
}
