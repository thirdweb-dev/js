import { storybookThirdwebClient } from "@/storybook/utils";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { type AssetBalance, AssetsSectionUI } from "./AssetsSection";

const meta = {
  title: "Nebula/AssetsSection",
  component: AssetsSectionUI,
  decorators: [
    (Story) => (
      <div className="mx-auto h-dvh w-full max-w-[300px] bg-card p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AssetsSectionUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const tokensStub: AssetBalance[] = [
  {
    chain_id: 8453,
    token_address: "0xe8e55a847bb446d967ef92f4580162fb8f2d3f38",
    name: "Broge",
    symbol: "BROGE",
    decimals: 18,
    balance: "10000000000000000000000",
  },
  {
    chain_id: 8453,
    token_address: "0x8d2757ea27aabf172da4cca4e5474c76016e3dc5",
    name: "clBTC",
    symbol: "clBTC",
    decimals: 18,
    balance: "2",
  },
  {
    chain_id: 8453,
    token_address: "0xb56d0839998fd79efcd15c27cf966250aa58d6d3",
    name: "BASED USA",
    symbol: "USA",
    decimals: 18,
    balance: "1000000000000000000",
  },
  {
    chain_id: 8453,
    token_address: "0x600c9b69a65fb6d2551623a53ddef17b050233cd",
    name: "BearPaw",
    symbol: "PAW",
    decimals: 18,
    balance: "48888800000000000000",
  },
  {
    chain_id: 8453,
    token_address: "0x4c96a67b0577358894407af7bc3158fc1dffbeb5",
    name: "Degen Point Of View",
    symbol: "POV",
    decimals: 18,
    balance: "69000000000000000000",
  },
  {
    chain_id: 8453,
    token_address: "0x4200000000000000000000000000000000000006",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    balance: "6237535850425",
  },
];

export const MultipleAssets: Story = {
  args: {
    data: tokensStub,
    isPending: false,
    client: storybookThirdwebClient,
  },
};

export const SingleAsset: Story = {
  args: {
    data: tokensStub.slice(0, 1),
    isPending: false,
    client: storybookThirdwebClient,
  },
};

export const EmptyAssets: Story = {
  args: {
    data: [],
    isPending: false,
    client: storybookThirdwebClient,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    isPending: true,
    client: storybookThirdwebClient,
  },
};
