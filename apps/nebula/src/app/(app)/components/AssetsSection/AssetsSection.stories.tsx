import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookThirdwebClient } from "@/storybook/utils";
import { type AssetBalance, AssetsSectionUI } from "./AssetsSection";

const meta = {
  component: AssetsSectionUI,
  decorators: [
    (Story) => (
      <div className="mx-auto h-dvh w-full max-w-[300px] bg-card p-2">
        <Story />
      </div>
    ),
  ],
  title: "Nebula/AssetsSection",
} satisfies Meta<typeof AssetsSectionUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const tokensStub: AssetBalance[] = [
  {
    balance: "10000000000000000000000",
    chain_id: 8453,
    decimals: 18,
    name: "Broge",
    symbol: "BROGE",
    token_address: "0xe8e55a847bb446d967ef92f4580162fb8f2d3f38",
  },
  {
    balance: "2",
    chain_id: 8453,
    decimals: 18,
    name: "clBTC",
    symbol: "clBTC",
    token_address: "0x8d2757ea27aabf172da4cca4e5474c76016e3dc5",
  },
  {
    balance: "1000000000000000000",
    chain_id: 8453,
    decimals: 18,
    name: "BASED USA",
    symbol: "USA",
    token_address: "0xb56d0839998fd79efcd15c27cf966250aa58d6d3",
  },
  {
    balance: "48888800000000000000",
    chain_id: 8453,
    decimals: 18,
    name: "BearPaw",
    symbol: "PAW",
    token_address: "0x600c9b69a65fb6d2551623a53ddef17b050233cd",
  },
  {
    balance: "69000000000000000000",
    chain_id: 8453,
    decimals: 18,
    name: "Degen Point Of View",
    symbol: "POV",
    token_address: "0x4c96a67b0577358894407af7bc3158fc1dffbeb5",
  },
  {
    balance: "6237535850425",
    chain_id: 8453,
    decimals: 18,
    name: "Wrapped Ether",
    symbol: "WETH",
    token_address: "0x4200000000000000000000000000000000000006",
  },
];

export const MultipleAssets: Story = {
  args: {
    client: storybookThirdwebClient,
    data: tokensStub,
    isPending: false,
  },
};

export const SingleAsset: Story = {
  args: {
    client: storybookThirdwebClient,
    data: tokensStub.slice(0, 1),
    isPending: false,
  },
};

export const EmptyAssets: Story = {
  args: {
    client: storybookThirdwebClient,
    data: [],
    isPending: false,
  },
};

export const Loading: Story = {
  args: {
    client: storybookThirdwebClient,
    data: [],
    isPending: true,
  },
};
