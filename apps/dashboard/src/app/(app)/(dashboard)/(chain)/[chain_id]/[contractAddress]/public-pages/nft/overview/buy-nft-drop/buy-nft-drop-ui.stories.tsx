import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookLog, storybookThirdwebClient } from "stories/utils";
import { NATIVE_TOKEN_ADDRESS, type NFT, getContract, toUnits } from "thirdweb";
import { type ChainMetadata, baseSepolia } from "thirdweb/chains";
import type { getActiveClaimCondition } from "thirdweb/extensions/erc721";
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";
import { PublicPageConnectButton } from "../../../_components/PublicPageConnectButton";
import { BuyNFTDropUI, type BuyNFTDropUIProps } from "./buy-nft-drop-ui.client";

const baseUSDC = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  decimals: 6,
  symbol: "USDC",
};

const meta = {
  title: "Assets/NFT/BuyNFTDropUI",
  component: Variant,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div>
        <ThirdwebProvider>
          <Story />
        </ThirdwebProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PriceInNativeToken: Story = {
  args: {
    totalUnclaimedSupply: BigInt(50),
    totalNFTs: 1000,
  },
};

export const PriceInERC20: Story = {
  args: {
    totalUnclaimedSupply: BigInt(5),
    totalNFTs: 10000,
    claimCondition: {
      ...getClaimConditionMock(),
      currency: baseUSDC.address,
      pricePerToken: toUnits("10", baseUSDC.decimals),
      decimals: baseUSDC.decimals,
      symbol: baseUSDC.symbol,
    },
    getNFTDropClaimParams: async (params) => {
      const values = await getNFTDropClaimParamsMock(params);
      return {
        ...values,
        pricePerTokenWei: toUnits("10", baseUSDC.decimals),
        currencyAddress: baseUSDC.address,
        decimals: baseUSDC.decimals,
        symbol: baseUSDC.symbol,
      };
    },
  },
};

export const UserGetsSpecialPrice: Story = {
  args: {
    totalUnclaimedSupply: BigInt(5),
    totalNFTs: 10000,
    getNFTDropClaimParams: async (params) => {
      const values = await getNFTDropClaimParamsMock(params);
      return {
        ...values,
        pricePerTokenWei: toUnits("0.1", 18),
        currencyAddress: NATIVE_TOKEN_ADDRESS,
        decimals: 18,
        symbol: "ETH",
      };
    },
    claimCondition: {
      ...getClaimConditionMock(),
      pricePerToken: toUnits("0.5", 18),
    },
  },
};

export const Pending: Story = {
  args: {
    totalUnclaimedSupply: BigInt(10000),
    totalNFTs: 20000,
    forcePending: true,
  },
};

export const AllClaimed: Story = {
  args: {
    totalUnclaimedSupply: BigInt(0),
    totalNFTs: 1000,
  },
};

function Variant(props: {
  totalUnclaimedSupply: bigint;
  totalNFTs: number;
  claimCondition?: ClaimCondition & {
    decimals: number;
    symbol: string;
  };
  forcePending?: boolean;
  getNFTDropClaimParams?: BuyNFTDropUIProps["getNFTDropClaimParams"];
  getNFTsToClaim?: BuyNFTDropUIProps["getNFTsToClaim"];
}) {
  const account = useActiveAccount();

  return (
    <div className="space-y-4">
      <div className="container mt-5 max-w-md space-y-3 border border-dashed py-4">
        <PublicPageConnectButton connectButtonClassName="!w-full" />
      </div>

      <div className="container max-w-md py-10">
        <BuyNFTDropUI
          activeAccountAddress={account?.address}
          contract={mockContract}
          chainMetadata={baseSepoliaChainMetadata}
          claimCondition={props.claimCondition || getClaimConditionMock()}
          totalNFTs={props.totalNFTs}
          nextTokenIdToClaim={BigInt(5)}
          totalUnclaimedSupply={props.totalUnclaimedSupply}
          getNFTsToClaim={
            props.getNFTsToClaim ||
            (props.forcePending
              ? async (values) => {
                  await new Promise((resolve) =>
                    setTimeout(resolve, 10000000000),
                  );
                  return getNFTsToClaimMock(values);
                }
              : getNFTsToClaimMock)
          }
          getNFTDropClaimParams={
            props.getNFTDropClaimParams ||
            (props.forcePending
              ? async (values) => {
                  await new Promise((resolve) =>
                    setTimeout(resolve, 10000000000),
                  );
                  return getNFTDropClaimParamsMock(values);
                }
              : getNFTDropClaimParamsMock)
          }
          handleSubmit={async (form) => {
            storybookLog(form.getValues());
          }}
        />
      </div>
    </div>
  );
}

const mockContract = getContract({
  address: "0xc3e13Ecf3B6C2Aa0F2Eb5e898De02d704352Aa54",
  chain: baseSepolia,
  client: storybookThirdwebClient,
});

const baseSepoliaChainMetadata: ChainMetadata = {
  chainId: 84532,
  name: "Base Sepolia Testnet",
  chain: "ETH",
  shortName: "basesep",
  icon: {
    url: "ipfs://QmaxRoHpxZd8PqccAynherrMznMufG6sdmHZLihkECXmZv",
    width: 1200,
    height: 1200,
    format: "png",
  },
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  stackType: "evm",
  explorers: [
    {
      name: "basescout",
      url: "https://base-sepolia.blockscout.com",
      standard: "EIP3091",
      icon: {
        url: "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        width: 551,
        height: 540,
        format: "png",
      },
    },
  ],
  rpc: ["https://84532.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
  testnet: true,
  infoURL: "https://base.org",
  slug: "base-sepolia-testnet",
  networkId: 84532,
};

type ClaimCondition = Awaited<ReturnType<typeof getActiveClaimCondition>>;

// 1.5 ETH in wei
function getClaimConditionMock() {
  const mockClaimCondition: ClaimCondition & {
    decimals: number;
    symbol: string;
  } = {
    startTimestamp: BigInt(Date.now()),
    maxClaimableSupply: BigInt(100),
    supplyClaimed: BigInt(0),
    quantityLimitPerWallet: BigInt(10),
    merkleRoot: "0x0",
    pricePerToken: toUnits("1.5", 18), // 1.5 ETH in wei
    currency: NATIVE_TOKEN_ADDRESS,
    metadata: "",
    decimals: 18,
    symbol: "ETH",
  };

  return mockClaimCondition;
}

// 1.5 ETH in wei
const getNFTDropClaimParamsMock: BuyNFTDropUIProps["getNFTDropClaimParams"] =
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      pricePerTokenWei: toUnits("1.5", 18), // 1.5 ETH in wei
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      decimals: 18,
      symbol: "ETH",
    };
  };

function getMockERC721NFT(id: bigint) {
  const mockNFT: NFT = {
    metadata: {
      uri: "",
      name: "Mock NFT",
      description: "A mock NFT for storybook.",
      image: `https://picsum.photos/200/200?random=${id}`,
      animation_url: "",
    },
    owner: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
    id,
    tokenURI: "...",
    type: "ERC721",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    chainId: baseSepolia.id,
  };

  return mockNFT;
}

const getNFTsToClaimMock: BuyNFTDropUIProps["getNFTsToClaim"] = async ({
  count,
  nextTokenIdToClaim,
}) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return Array.from({ length: count }, (_, i) =>
    getMockERC721NFT(nextTokenIdToClaim + BigInt(i)),
  );
};
