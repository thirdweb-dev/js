import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookThirdwebClient } from "stories/utils";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";
import { TokenDropClaim } from "./claim-tokens-ui";

const meta = {
  component: Story,
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
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "ERC20/ClaimTokenCardUI",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Variants: Story = {
  args: {},
};

const mockContract = getContract({
  address: "0xD6866d1EcB82D37556B6cFEc0dFE8800D8b4B50A",
  chain: baseSepolia,
  client: storybookThirdwebClient,
});

const claimConditionCurrency = {
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  decimals: 18,
  symbol: "ETH",
};

const mockClaimCondition = {
  currency: claimConditionCurrency.address,
  maxClaimableSupply:
    115792089237316195423570985008687907853269984665640564039457584007913129639935n,
  merkleRoot:
    "0x369b56a08dc68160042e86415132e683545596577b2f6afa272046c18cbab38b",
  metadata: "ipfs://QmPgawkS1jYSudujQGzx2UbodZzNPbMgWto1LPEba1Pxpj/0",
  pricePerToken: 0n,
  quantityLimitPerWallet: 0n,
  startTimestamp: 1747918865n,
  supplyClaimed: 790000000000000000000000n,
};

function Story() {
  return (
    <TokenDropClaim
      chainMetadata={{
        chain: "ETH",
        chainId: 11155111,
        name: "Sepolia",
        nativeCurrency: {
          decimals: 18,
          name: "Sepolia Ether",
          symbol: "ETH",
        },
        // biome-ignore lint/suspicious/noTemplateCurlyInString: EXPECTED
        rpc: ["https://11155111.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
        shortName: "sep",
        slug: "sepolia",
        stackType: "evm",
        testnet: true,
      }}
      claimCondition={mockClaimCondition}
      claimConditionCurrency={claimConditionCurrency}
      contract={mockContract}
      decimals={18}
      name="Example Token"
      symbol="EXP"
    />
  );
}
