import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "@/storybook/utils";
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
      <BadgeContainer label="5.5 / Unlimited Supply">
        <SupplyClaimedProgress
          claimedSupplyTokens={5.5}
          totalSupplyTokens="unlimited"
        />
      </BadgeContainer>

      <BadgeContainer label="10 / Unlimited Supply">
        <SupplyClaimedProgress
          claimedSupplyTokens={10}
          totalSupplyTokens="unlimited"
        />
      </BadgeContainer>

      <BadgeContainer label="500/1000 Supply">
        <SupplyClaimedProgress
          claimedSupplyTokens={500}
          totalSupplyTokens={1000}
        />
      </BadgeContainer>

      <BadgeContainer label="123.45/1000 Supply">
        <SupplyClaimedProgress
          claimedSupplyTokens={123.45}
          totalSupplyTokens={1000}
        />
      </BadgeContainer>

      <BadgeContainer label="10/1M Supply">
        <SupplyClaimedProgress
          claimedSupplyTokens={10}
          totalSupplyTokens={1000000}
        />
      </BadgeContainer>

      <BadgeContainer label="0/1M Supply">
        <SupplyClaimedProgress
          claimedSupplyTokens={0}
          totalSupplyTokens={1000000}
        />
      </BadgeContainer>

      <BadgeContainer label="10/10 Supply">
        <SupplyClaimedProgress
          claimedSupplyTokens={10}
          totalSupplyTokens={10}
        />
      </BadgeContainer>

      <BadgeContainer label="0 Supply - don't show anything">
        <SupplyClaimedProgress claimedSupplyTokens={0} totalSupplyTokens={0} />
      </BadgeContainer>
    </div>
  );
}
