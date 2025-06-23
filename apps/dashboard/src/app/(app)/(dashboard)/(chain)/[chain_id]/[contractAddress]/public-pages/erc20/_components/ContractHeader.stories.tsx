import type { Meta, StoryObj } from "@storybook/nextjs";
import { getContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";
import { storybookThirdwebClient } from "@/storybook/utils";
import { ContractHeaderUI } from "./ContractHeader";

const meta = {
  component: ContractHeaderUI,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="container max-w-7xl py-10">
          <Story />
        </div>
      </ThirdwebProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "ERC20/ContractHeader",
} satisfies Meta<typeof ContractHeaderUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTokenImage =
  "ipfs://ipfs/QmXYgTEavjF6c9X1a2pt5E379MYqSwFzzKvsUbSnRiSUEc/ea207d218948137.67aa26cfbd956.png";

const ethereumChainMetadata: ChainMetadata = {
  chain: "ethereum",
  chainId: 1,
  explorers: [
    {
      name: "Etherscan",
      standard: "EIP3091",
      url: "https://etherscan.io",
    },
  ],
  icon: {
    format: "svg",
    height: 24,
    url: "https://thirdweb.com/chain-icons/ethereum.svg",
    width: 24,
  },
  name: "Ethereum Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  networkId: 1,
  rpc: ["https://eth.llamarpc.com"],
  shortName: "eth",
  slug: "ethereum",
  stackType: "evm",
  testnet: false,
};

const mockContract = getContract({
  address: "0x1234567890123456789012345678901234567890",
  chain: {
    id: 1,
    name: "Ethereum",
    rpc: "https://eth.llamarpc.com",
  },
  client: storybookThirdwebClient,
});

const mockSocialUrls = {
  custom: "https://example.com",
  discord: "https://discord.gg",
  github: "https://github.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  reddit: "https://reddit.com",
  telegram: "https://web.telegram.org/",
  tiktok: "https://tiktok.com",
  twitter: "https://twitter.com",
  website: "https://example.com",
  youtube: "https://youtube.com",
};

export const WithImageAndMultipleSocialUrls: Story = {
  args: {
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    image: mockTokenImage,
    name: "Sample Token",
    socialUrls: {
      discord: mockSocialUrls.discord,
      github: mockSocialUrls.github,
      telegram: mockSocialUrls.telegram,
      twitter: mockSocialUrls.twitter,
      website: mockSocialUrls.website,
    },
    symbol: "SMPL",
  },
};

export const WithBrokenImageAndSingleSocialUrl: Story = {
  args: {
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    image: "broken-image.png",
    name: "Sample Token",
    socialUrls: {
      website: mockSocialUrls.website,
    },
    symbol: "SMPL",
  },
};

export const WithoutImageAndNoSocialUrls: Story = {
  args: {
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    image: undefined,
    name: "Sample Token",
    socialUrls: {},
    symbol: "SMPL",
  },
};

export const LongNameAndLotsOfSocialUrls: Story = {
  args: {
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    name: "This is a very long token name that should wrap to multiple lines",
    socialUrls: {
      discord: mockSocialUrls.discord,
      github: mockSocialUrls.github,
      reddit: mockSocialUrls.reddit,
      telegram: mockSocialUrls.telegram,
      twitter: mockSocialUrls.twitter,
      website: mockSocialUrls.website,
      youtube: mockSocialUrls.youtube,
    },
    symbol: "LONG",
  },
};

export const AllSocialUrls: Story = {
  args: {
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    name: "Sample Token",
    socialUrls: {
      custom: mockSocialUrls.custom,
      discord: mockSocialUrls.discord,
      github: mockSocialUrls.github,
      instagram: mockSocialUrls.instagram,
      linkedin: mockSocialUrls.linkedin,
      reddit: mockSocialUrls.reddit,
      telegram: mockSocialUrls.telegram,
      tiktok: mockSocialUrls.tiktok,
      twitter: mockSocialUrls.twitter,
      website: mockSocialUrls.website,
      youtube: mockSocialUrls.youtube,
    },
    symbol: "SMPL",
  },
};

export const InvalidSocialUrls: Story = {
  args: {
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    name: "Sample Token",
    socialUrls: {
      discord: "invalid-url",
      reddit: "",
      telegram: "invalid-url",
      twitter: "invalid-url",
      youtube: mockSocialUrls.youtube,
    },
    symbol: "SMPL",
  },
};

export const SomeSocialUrls: Story = {
  args: {
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    name: "Sample Token",
    socialUrls: {
      twitter: mockSocialUrls.twitter,
      website: mockSocialUrls.website,
    },
    symbol: "SMPL",
  },
};
