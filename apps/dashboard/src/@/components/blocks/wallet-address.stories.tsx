import type { Meta, StoryObj } from "@storybook/nextjs";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import type { SocialProfile } from "thirdweb/react";
import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import { WalletAddress, WalletAddressUI } from "./wallet-address";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/WalletAddress",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  const client = storybookThirdwebClient as unknown as ThirdwebClient;

  return (
    <div className="container flex max-w-4xl flex-col gap-8 py-10">
      <BadgeContainer label="Social Profiles Loaded">
        <WalletAddressUI
          address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          client={client}
          profiles={{
            data: vitalikEth,
            isPending: false,
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="No Social Profiles">
        <WalletAddressUI
          address="0x83Dd93fA5D8343094f850f90B3fb90088C1bB425"
          client={client}
          shortenAddress
          profiles={{
            data: [],
            isPending: false,
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading Social Profiles">
        <WalletAddressUI
          address="0x83Dd93fA5D8343094f850f90B3fb90088C1bB425"
          client={client}
          shortenAddress
          profiles={{
            data: [],
            isPending: true,
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="Zero address">
        <WalletAddressUI
          address={ZERO_ADDRESS}
          client={client}
          profiles={{
            data: [],
            isPending: false,
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="Real Component - Invalid Address">
        <WalletAddress address="not-an-address" client={client} />
      </BadgeContainer>

      <BadgeContainer label="Real Component - vitalik.eth">
        <WalletAddress
          address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          client={client}
        />
      </BadgeContainer>
    </div>
  );
}

const vitalikEth: SocialProfile[] = [
  {
    type: "ens",
    name: "vitalik.eth",
    bio: "mi pinxe lo crino tcati",
    avatar: "https://euc.li/vitalik.eth",
    metadata: {
      name: "vitalik.eth",
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      avatar: "https://euc.li/vitalik.eth",
      description: "mi pinxe lo crino tcati",
      url: "https://vitalik.ca",
    },
  },
  {
    type: "farcaster",
    name: "vitalik.eth",
    bio: undefined,
    avatar:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/b663cd63-fecf-4d0f-7f87-0e0b6fd42800/original",
    metadata: {
      fid: 5650,
      bio: undefined,
      pfp: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/b663cd63-fecf-4d0f-7f87-0e0b6fd42800/original",
      username: "vitalik.eth",
      addresses: [
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "0x96B6bB2bd2Eba3b4Fbefd7DbAC448ad7B6CBf279",
      ],
    },
  },
];
