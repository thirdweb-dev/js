import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookThirdwebClient } from "stories/utils";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";
import { ClaimTokenCardUI } from "./claim-tokens-ui";

const meta = {
  title: "ERC20/ClaimTokenCardUI",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="py-10">
          <div className="mx-auto w-96">
            <Story />
          </div>
        </div>
      </ThirdwebProvider>
    ),
  ],
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Variants: Story = {
  args: {},
};

const mockContract = getContract({
  client: storybookThirdwebClient,
  chain: baseSepolia,
  address: "0xD6866d1EcB82D37556B6cFEc0dFE8800D8b4B50A",
});

const claimConditionCurrency = {
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  decimals: 18,
  symbol: "ETH",
};

const mockClaimCondition = {
  startTimestamp: 1747918865n,
  maxClaimableSupply:
    115792089237316195423570985008687907853269984665640564039457584007913129639935n,
  supplyClaimed: 790000000000000000000000n,
  quantityLimitPerWallet: 0n,
  merkleRoot:
    "0x369b56a08dc68160042e86415132e683545596577b2f6afa272046c18cbab38b",
  pricePerToken: 0n,
  currency: claimConditionCurrency.address,
  metadata: "ipfs://QmPgawkS1jYSudujQGzx2UbodZzNPbMgWto1LPEba1Pxpj/0",
};

function Story() {
  return (
    <ClaimTokenCardUI
      contract={mockContract}
      name="Example Token"
      symbol="EXP"
      claimCondition={mockClaimCondition}
      claimConditionCurrency={claimConditionCurrency}
      chainMetadata={{
        stackType: "evm",
        chainId: 11155111,
        name: "Sepolia",
        chain: "ETH",
        shortName: "sep",
        nativeCurrency: {
          name: "Sepolia Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpc: ["https://11155111.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
        testnet: true,
        slug: "sepolia",
      }}
      decimals={18}
    />
  );
}
