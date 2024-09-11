import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { LinkWalletUI } from "./LinkWalletUI";

const meta = {
  title: "Account/LinkWallets",
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    type: "desktop",
  },
};

export const Mobile: Story = {
  args: {
    type: "mobile",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Variants() {
  return (
    <ThirdwebProvider>
      <div className="container py-10 max-w-[1100px] mx-auto w-full flex flex-col gap-10">
        <BadgeContainer label="4 wallets">
          <LinkWalletUI
            wallets={[
              "0x51696930092b42243dee1077c8dd237074fb28d4", // jns.eth - ens
              "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // vitalik.eth - ens, farcaster, lens
              "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37", // no ens
            ]}
          />
        </BadgeContainer>

        <BadgeContainer label="1 wallet">
          <LinkWalletUI
            wallets={[
              "0x51696930092b42243dee1077c8dd237074fb28d4", // jns.eth
            ]}
          />
        </BadgeContainer>

        <BadgeContainer label="0 wallets">
          <LinkWalletUI wallets={[]} />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}
