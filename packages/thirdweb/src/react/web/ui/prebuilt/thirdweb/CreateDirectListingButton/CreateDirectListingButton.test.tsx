import { describe, expect, it } from "vitest";
import { render, screen } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { sepolia } from "../../../../../../chains/chain-definitions/sepolia.js";
import { CreateDirectListingButton } from "./index.js";

const client = TEST_CLIENT;

// marketplace v3 on sepolia
const marketplaceAddress = "0xe0eFD6fb388405b67b3E9FaFc02649c70E749f03";

describe.runIf(process.env.TW_SECRET_KEY)("BuyDirectListingButton", () => {
  it("should render", () => {
    render(
      <CreateDirectListingButton
        client={client}
        chain={sepolia}
        contractAddress={marketplaceAddress}
        assetContractAddress="0x3cf279b3248E164F3e5C341826B878d350EC6AB1"
        tokenId={0n}
        pricePerToken="0.1"
      >
        Sell NFT
      </CreateDirectListingButton>,
    );
    expect(screen.queryByText("Sell NFT")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
