import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookThirdwebClient } from "@/storybook/utils";
import {
  TransactionSectionUI,
  type WalletTransaction,
} from "./TransactionsSection";

const meta = {
  component: TransactionSectionUI,
  decorators: [
    (Story) => (
      <div className="mx-auto h-dvh w-full max-w-[300px] bg-card p-2">
        <Story />
      </div>
    ),
  ],
  title: "AI/TransactionsSection",
} satisfies Meta<typeof TransactionSectionUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const transactionsStub: WalletTransaction[] = [
  {
    chain_id: "8453",
    decoded: {
      inputs: {
        to: "0x83dd93fa5d8343094f850f90b3fb90088c1bb425",
        value: "10000",
      },
      name: "transfer",
      signature: "transfer(address,uint256)",
    },
    from_address: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
    hash: "0x2a098695dcfa32a67ec115af7c8da1ef6f443ea72baf7e49525204dd521a985e",
    to_address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    value: "0",
  },
  {
    chain_id: "8453",
    decoded: {
      inputs: null,
      name: "",
      signature: "",
    },
    from_address: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
    hash: "0xc521bfa0ba3e68fa1a52c67f93a8e215d3ade0b45956ba215390bcc0576202f1",
    to_address: "0x83dd93fa5d8343094f850f90b3fb90088c1bb425",
    value: "1000000000000000",
  },
  {
    chain_id: "8453",
    decoded: {
      inputs: null,
      name: "",
      signature: "",
    },
    from_address: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
    hash: "0xf2d92059c9ea425ccf7568bfe2589b3c7e45b108b5af658ec79c2f2d3723e410",
    to_address: "0x83dd93fa5d8343094f850f90b3fb90088c1bb425",
    value: "1000000000000000",
  },
  {
    chain_id: "8453",
    decoded: {
      inputs: {
        to: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
        value: "100000",
      },
      name: "transfer",
      signature: "transfer(address,uint256)",
    },
    from_address: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
    hash: "0xea3da430876c09acfa665450a91edb99fe8dc018864c5dfa3ac53bf265ce8d66",
    to_address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    value: "0",
  },
  {
    chain_id: "8453",
    decoded: {
      inputs: {
        spender: "0xf8ab2dbe6c43bf1a856471182290f91d621ba76d",
        value: "10000000",
      },
      name: "approve",
      signature: "approve(address,uint256)",
    },
    from_address: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
    hash: "0xad03e5b350645f2e4cdd066c30b2f6b708aa34bd4d1c5ca20fd81ecfe1656164",
    to_address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    value: "0",
  },
  {
    chain_id: "8453",
    decoded: {
      inputs: {},
      name: "initiateTransaction",
      signature:
        "initiateTransaction((bytes32,address,uint256,address,address,uint256,address,uint256,bytes,bytes),bytes)",
    },
    from_address: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
    hash: "0xd3106aaa4b7e530ac7530c8ea4984eec52670aabaf5969ae6bc8d8246e74c3c0",
    to_address: "0xf8ab2dbe6c43bf1a856471182290f91d621ba76d",
    value: "0",
  },
  {
    chain_id: "8453",
    decoded: {
      inputs: {
        spender: "0xf8ab2dbe6c43bf1a856471182290f91d621ba76d",
        value: "1000000",
      },
      name: "approve",
      signature: "approve(address,uint256)",
    },
    from_address: "0x1f846f6dae38e1c88d71eaa191760b15f38b7a37",
    hash: "0xd284b6e0dd938b4610ff1877c1d4692a8d10d83ec6be24789dc87e1ef4aa4756",
    to_address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    value: "0",
  },
];

export const MultipleAssets: Story = {
  args: {
    client: storybookThirdwebClient,
    data: transactionsStub,
    isPending: false,
  },
};

export const SingleAsset: Story = {
  args: {
    client: storybookThirdwebClient,
    data: transactionsStub.slice(0, 1),
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
