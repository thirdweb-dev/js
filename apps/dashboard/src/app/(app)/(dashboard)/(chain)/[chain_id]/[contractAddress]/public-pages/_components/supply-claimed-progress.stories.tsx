import type { Meta, StoryObj } from "@storybook/nextjs";
import { maxUint256 } from "thirdweb/utils";
import { BadgeContainer } from "../../../../../../../../stories/utils";
import { SupplyClaimedProgress } from "./supply-claimed-progress";

const meta = {
  component: StoryVariants,
  title: "Assets/NFT/SupplyClaimedProgress",
} satisfies Meta<typeof StoryVariants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function StoryVariants() {
  return (
    <div className="container max-w-md space-y-10 py-10">
      <BadgeContainer label="10 / Unlimited Supply">
        <SupplyClaimedProgress claimedSupply={10n} totalSupply={maxUint256} />
      </BadgeContainer>

      <BadgeContainer label="500/1000 Supply">
        <SupplyClaimedProgress claimedSupply={500n} totalSupply={1000n} />
      </BadgeContainer>

      <BadgeContainer label="10/1M Supply">
        <SupplyClaimedProgress claimedSupply={10n} totalSupply={1000000n} />
      </BadgeContainer>

      <BadgeContainer label="0/1M Supply">
        <SupplyClaimedProgress claimedSupply={0n} totalSupply={1000000n} />
      </BadgeContainer>

      <BadgeContainer label="10/10 Supply">
        <SupplyClaimedProgress claimedSupply={10n} totalSupply={10n} />
      </BadgeContainer>

      <BadgeContainer label="0 Supply - don't show anything">
        <SupplyClaimedProgress claimedSupply={0n} totalSupply={0n} />
      </BadgeContainer>
    </div>
  );
}
