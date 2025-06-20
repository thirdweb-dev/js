import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookLog, storybookThirdwebClient } from "stories/utils";
import { getContract, NATIVE_TOKEN_ADDRESS, type NFT, toUnits } from "thirdweb";
import { baseSepolia, type ChainMetadata } from "thirdweb/chains";
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
  component: Variant,
  decorators: [
    (Story) => (
      <div>
        <ThirdwebProvider>
          <Story />
        </ThirdwebProvider>
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Assets/NFT/BuyNFTDropUI",
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PriceInNativeToken: Story = {
  args: {
    totalNFTs: 1000,
    totalUnclaimedSupply: BigInt(50),
  },
};

export const PriceInERC20: Story = {
  args: {
    claimCondition: {
      ...getClaimConditionMock(),
      currency: baseUSDC.address,
      decimals: baseUSDC.decimals,
      pricePerToken: toUnits("10", baseUSDC.decimals),
      symbol: baseUSDC.symbol,
    },
    getNFTDropClaimParams: async (params) => {
      const values = await getNFTDropClaimParamsMock(params);
      return {
        ...values,
        currencyAddress: baseUSDC.address,
        decimals: baseUSDC.decimals,
        pricePerTokenWei: toUnits("10", baseUSDC.decimals),
        symbol: baseUSDC.symbol,
      };
    },
    totalNFTs: 10000,
    totalUnclaimedSupply: BigInt(5),
  },
};

export const UserGetsSpecialPrice: Story = {
  args: {
    claimCondition: {
      ...getClaimConditionMock(),
      pricePerToken: toUnits("0.5", 18),
    },
    getNFTDropClaimParams: async (params) => {
      const values = await getNFTDropClaimParamsMock(params);
      return {
        ...values,
        currencyAddress: NATIVE_TOKEN_ADDRESS,
        decimals: 18,
        pricePerTokenWei: toUnits("0.1", 18),
        symbol: "ETH",
      };
    },
    totalNFTs: 10000,
    totalUnclaimedSupply: BigInt(5),
  },
};

export const Pending: Story = {
  args: {
    forcePending: true,
    totalNFTs: 20000,
    totalUnclaimedSupply: BigInt(10000),
  },
};

export const AllClaimed: Story = {
  args: {
    totalNFTs: 1000,
    totalUnclaimedSupply: BigInt(0),
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
          chainMetadata={baseSepoliaChainMetadata}
          claimCondition={props.claimCondition || getClaimConditionMock()}
          contract={mockContract}
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
          handleSubmit={async (form) => {
            storybookLog(form.getValues());
          }}
          nextTokenIdToClaim={BigInt(5)}
          totalNFTs={props.totalNFTs}
          totalUnclaimedSupply={props.totalUnclaimedSupply}
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
  chain: "ETH",
  chainId: 84532,
  explorers: [
    {
      icon: {
        format: "png",
        height: 540,
        url: "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        width: 551,
      },
      name: "basescout",
      standard: "EIP3091",
      url: "https://base-sepolia.blockscout.com",
    },
  ],
  icon: {
    format: "png",
    height: 1200,
    url: "ipfs://QmaxRoHpxZd8PqccAynherrMznMufG6sdmHZLihkECXmZv",
    width: 1200,
  },
  infoURL: "https://base.org",
  name: "Base Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "ETH",
  },
  networkId: 84532,
  // biome-ignore lint/suspicious/noTemplateCurlyInString: EXPECTED
  rpc: ["https://84532.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
  shortName: "basesep",
  slug: "base-sepolia-testnet",
  stackType: "evm",
  testnet: true,
};

type ClaimCondition = Awaited<ReturnType<typeof getActiveClaimCondition>>;

// 1.5 ETH in wei
function getClaimConditionMock() {
  const mockClaimCondition: ClaimCondition & {
    decimals: number;
    symbol: string;
  } = {
    currency: NATIVE_TOKEN_ADDRESS,
    decimals: 18,
    maxClaimableSupply: BigInt(100),
    merkleRoot: "0x0",
    metadata: "",
    pricePerToken: toUnits("1.5", 18), // 1.5 ETH in wei
    quantityLimitPerWallet: BigInt(10),
    startTimestamp: BigInt(Date.now()),
    supplyClaimed: BigInt(0),
    symbol: "ETH",
  };

  return mockClaimCondition;
}

// 1.5 ETH in wei
const getNFTDropClaimParamsMock: BuyNFTDropUIProps["getNFTDropClaimParams"] =
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      currencyAddress: NATIVE_TOKEN_ADDRESS, // 1.5 ETH in wei
      decimals: 18,
      pricePerTokenWei: toUnits("1.5", 18),
      symbol: "ETH",
    };
  };

function getMockERC721NFT(id: bigint) {
  const mockNFT: NFT = {
    chainId: baseSepolia.id,
    id,
    metadata: {
      animation_url: "",
      description: "A mock NFT for storybook.",
      image: `https://picsum.photos/200/200?random=${id}`,
      name: "Mock NFT",
      uri: "",
    },
    owner: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    tokenURI: "...",
    type: "ERC721",
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
