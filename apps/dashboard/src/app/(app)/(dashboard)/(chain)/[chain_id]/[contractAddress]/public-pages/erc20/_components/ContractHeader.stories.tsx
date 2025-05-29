import type { Meta, StoryObj } from "@storybook/react";
import { storybookThirdwebClient } from "stories/utils";
import { getContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";
import { ContractHeaderUI } from "./ContractHeader";

const meta = {
  title: "ERC20/ContractHeader",
  component: ContractHeaderUI,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="container max-w-7xl py-10">
          <Story />
        </div>
      </ThirdwebProvider>
    ),
  ],
} satisfies Meta<typeof ContractHeaderUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTokenImage =
  "ipfs://ipfs/QmXYgTEavjF6c9X1a2pt5E379MYqSwFzzKvsUbSnRiSUEc/ea207d218948137.67aa26cfbd956.png";

const ethereumChainMetadata: ChainMetadata = {
  name: "Ethereum Mainnet",
  chain: "ethereum",
  chainId: 1,
  networkId: 1,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: ["https://eth.llamarpc.com"],
  shortName: "eth",
  slug: "ethereum",
  testnet: false,
  icon: {
    url: "https://thirdweb.com/chain-icons/ethereum.svg",
    width: 24,
    height: 24,
    format: "svg",
  },
  explorers: [
    {
      name: "Etherscan",
      url: "https://etherscan.io",
      standard: "EIP3091",
    },
  ],
  stackType: "evm",
};

const mockContract = getContract({
  client: storybookThirdwebClient,
  chain: {
    id: 1,
    name: "Ethereum",
    rpc: "https://eth.llamarpc.com",
  },
  address: "0x1234567890123456789012345678901234567890",
});

const mockSocialUrls = {
  twitter: "https://twitter.com",
  discord: "https://discord.gg",
  telegram: "https://web.telegram.org/",
  website: "https://example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  tiktok: "https://tiktok.com",
  instagram: "https://instagram.com",
  custom: "https://example.com",
  reddit: "https://reddit.com",
  youtube: "https://youtube.com",
};

export const WithImageAndMultipleSocialUrls: Story = {
  args: {
    name: "Sample Token",
    symbol: "SMPL",
    image: mockTokenImage,
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    socialUrls: {
      twitter: mockSocialUrls.twitter,
      discord: mockSocialUrls.discord,
      telegram: mockSocialUrls.telegram,
      website: mockSocialUrls.website,
      github: mockSocialUrls.github,
    },
  },
};

export const WithBrokenImageAndSingleSocialUrl: Story = {
  args: {
    name: "Sample Token",
    symbol: "SMPL",
    image: "broken-image.png",
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    socialUrls: {
      website: mockSocialUrls.website,
    },
  },
};

export const WithoutImageAndNoSocialUrls: Story = {
  args: {
    name: "Sample Token",
    symbol: "SMPL",
    image: undefined,
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    socialUrls: {},
  },
};

export const LongNameAndLotsOfSocialUrls: Story = {
  args: {
    name: "This is a very long token name that should wrap to multiple lines",
    symbol: "LONG",
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    socialUrls: {
      twitter: mockSocialUrls.twitter,
      discord: mockSocialUrls.discord,
      telegram: mockSocialUrls.telegram,
      reddit: mockSocialUrls.reddit,
      youtube: mockSocialUrls.youtube,
      website: mockSocialUrls.website,
      github: mockSocialUrls.github,
    },
  },
};

export const AllSocialUrls: Story = {
  args: {
    name: "Sample Token",
    symbol: "SMPL",
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    socialUrls: {
      twitter: mockSocialUrls.twitter,
      discord: mockSocialUrls.discord,
      telegram: mockSocialUrls.telegram,
      reddit: mockSocialUrls.reddit,
      youtube: mockSocialUrls.youtube,
      website: mockSocialUrls.website,
      github: mockSocialUrls.github,
      linkedin: mockSocialUrls.linkedin,
      tiktok: mockSocialUrls.tiktok,
      instagram: mockSocialUrls.instagram,
      custom: mockSocialUrls.custom,
    },
  },
};

export const InvalidSocialUrls: Story = {
  args: {
    name: "Sample Token",
    symbol: "SMPL",
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    socialUrls: {
      twitter: "invalid-url",
      discord: "invalid-url",
      telegram: "invalid-url",
      reddit: "",
      youtube: mockSocialUrls.youtube,
    },
  },
};

export const SomeSocialUrls: Story = {
  args: {
    name: "Sample Token",
    symbol: "SMPL",
    image: "https://thirdweb.com/chain-icons/ethereum.svg",
    chainMetadata: ethereumChainMetadata,
    clientContract: mockContract,
    socialUrls: {
      website: mockSocialUrls.website,
      twitter: mockSocialUrls.twitter,
    },
  },
};
