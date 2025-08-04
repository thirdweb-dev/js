import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThirdwebProvider } from "thirdweb/react";
import type { LinkedWallet } from "@/api/account/linked-wallets";
import {
  BadgeContainer,
  mobileViewport,
  storybookThirdwebClient,
} from "@/storybook/utils";
import { LinkWalletUI } from "./LinkWalletUI";

const meta = {
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Account/Pages/Link Wallets",
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

const unlinkWalletSuccessStub = async (walletId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("unlinkWallet", walletId);
};

const unlinkWalletFailureStub = async (walletId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("unlinkWallet", walletId);
  throw new Error("Failed to unlink wallet");
};

const accountWalletsStub: LinkedWallet[] = [
  {
    createdAt: new Date().toISOString(), // jns.eth
    id: "1",
    walletAddress: "0x51696930092b42243dee1077c8dd237074fb28d4",
  },
  {
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 365 * 2,
    ).toISOString(), // no ens
    id: "2",
    walletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
  },
  {
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // vitalik.eth
    id: "3",
    walletAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  },
];

function Variants() {
  return (
    <ThirdwebProvider>
      <div className="container mx-auto flex w-full max-w-[1100px] flex-col gap-10 py-10">
        <BadgeContainer label="Unlink wallet success">
          <LinkWalletUI
            accountEmail="team@example.com"
            client={storybookThirdwebClient}
            unlinkWallet={unlinkWalletSuccessStub}
            wallets={accountWalletsStub}
          />
        </BadgeContainer>

        <BadgeContainer label="Unlink wallet failure">
          <LinkWalletUI
            accountEmail="team@example.com"
            client={storybookThirdwebClient}
            unlinkWallet={unlinkWalletFailureStub}
            wallets={accountWalletsStub}
          />
        </BadgeContainer>

        <BadgeContainer label="0 wallets">
          <LinkWalletUI
            accountEmail="team@example.com"
            client={storybookThirdwebClient}
            unlinkWallet={unlinkWalletSuccessStub}
            wallets={[]}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}
