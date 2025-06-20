import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { storybookThirdwebClient } from "stories/utils";
import { getAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import type { NFTMetadataWithPrice } from "./batch-upload/process-files";
import { type NFTData, UploadNFTsFieldset } from "./upload-nfts";

const meta = {
  component: Variant,
  decorators: [
    (Story) => (
      <div className="container max-w-5xl py-10">
        <ThirdwebProvider>
          <Story />
        </ThirdwebProvider>
      </div>
    ),
  ],
  title: "Asset/CreateNFT/UploadNFTsFieldset",
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

function getMockNFTData(params?: Partial<NFTMetadataWithPrice>) {
  const mockNFTData: NFTMetadataWithPrice = {
    attributes: [
      {
        trait_type: "test",
        value: "value",
      },
    ],
    description: "Test Description",
    image: "https://picsum.photos/500/500",
    name: "Test NFT",
    price_amount: "0.1",
    price_currency: getAddress(NATIVE_TOKEN_ADDRESS),
    supply: "1",
    ...params,
  };

  return mockNFTData;
}

export const MultipleNFTsNull: Story = {
  args: {
    nftData: {
      nfts: null,
      type: "multiple",
    },
  },
};

export const SingleNFTNull: Story = {
  args: {
    nftData: {
      nft: null,
      type: "single",
    },
  },
};

export const MultipleNFTsSet: Story = {
  args: {
    nftData: {
      nfts: {
        data: Array(5)
          .fill(null)
          .map((_, i) =>
            getMockNFTData({
              name: `Test NFT ${i + 1}`,
              price_amount: Math.random().toFixed(2),
            }),
          ),
        type: "data",
      },
      type: "multiple",
    },
  },
};

export const MultipleNFTsError: Story = {
  args: {
    nftData: {
      nfts: {
        error: "This is some error message",
        type: "error",
      },
      type: "multiple",
    },
  },
};

export const SingleNFTSet: Story = {
  args: {
    nftData: {
      nft: getMockNFTData(),
      type: "single",
    },
  },
};

function Variant(props: { nftData: NFTData }) {
  const [nftData, setNFTData] = useState<NFTData>(props.nftData);

  return (
    <UploadNFTsFieldset
      chainId={1}
      client={storybookThirdwebClient}
      nftData={nftData}
      onNext={() => console.log("next")}
      onPrev={() => console.log("prev")}
      setNFTData={setNFTData}
    />
  );
}
