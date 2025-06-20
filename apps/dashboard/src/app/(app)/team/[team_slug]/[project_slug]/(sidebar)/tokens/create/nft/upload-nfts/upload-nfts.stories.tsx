import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { storybookThirdwebClient } from "stories/utils";
import { NATIVE_TOKEN_ADDRESS, getAddress } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import type { NFTMetadataWithPrice } from "./batch-upload/process-files";
import { type NFTData, UploadNFTsFieldset } from "./upload-nfts";

const meta = {
  title: "Asset/CreateNFT/UploadNFTsFieldset",
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
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

function getMockNFTData(params?: Partial<NFTMetadataWithPrice>) {
  const mockNFTData: NFTMetadataWithPrice = {
    name: "Test NFT",
    description: "Test Description",
    image: "https://picsum.photos/500/500",
    price_amount: "0.1",
    price_currency: getAddress(NATIVE_TOKEN_ADDRESS),
    supply: "1",
    attributes: [
      {
        trait_type: "test",
        value: "value",
      },
    ],
    ...params,
  };

  return mockNFTData;
}

export const MultipleNFTsNull: Story = {
  args: {
    nftData: {
      type: "multiple",
      nfts: null,
    },
  },
};

export const SingleNFTNull: Story = {
  args: {
    nftData: {
      type: "single",
      nft: null,
    },
  },
};

export const MultipleNFTsSet: Story = {
  args: {
    nftData: {
      type: "multiple",
      nfts: {
        type: "data",
        data: Array(5)
          .fill(null)
          .map((_, i) =>
            getMockNFTData({
              name: `Test NFT ${i + 1}`,
              price_amount: Math.random().toFixed(2),
            }),
          ),
      },
    },
  },
};

export const MultipleNFTsError: Story = {
  args: {
    nftData: {
      type: "multiple",
      nfts: {
        type: "error",
        error: "This is some error message",
      },
    },
  },
};

export const SingleNFTSet: Story = {
  args: {
    nftData: {
      type: "single",
      nft: getMockNFTData(),
    },
  },
};

function Variant(props: {
  nftData: NFTData;
}) {
  const [nftData, setNFTData] = useState<NFTData>(props.nftData);

  return (
    <UploadNFTsFieldset
      client={storybookThirdwebClient}
      chainId={1}
      onNext={() => console.log("next")}
      onPrev={() => console.log("prev")}
      nftData={nftData}
      setNFTData={setNFTData}
    />
  );
}
