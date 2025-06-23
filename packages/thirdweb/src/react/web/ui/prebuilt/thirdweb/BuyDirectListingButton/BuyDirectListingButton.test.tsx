import { describe, expect, it } from "vitest";
import { render, screen } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { sepolia } from "../../../../../../chains/chain-definitions/sepolia.js";
import { BuyDirectListingButton } from "./index.js";

const client = TEST_CLIENT;

// marketplace v3 on sepolia
const marketplaceAddress = "0xe0eFD6fb388405b67b3E9FaFc02649c70E749f03";

describe.runIf(process.env.TW_SECRET_KEY)("BuyDirectListingButton", () => {
  it("should render", () => {
    render(
      <BuyDirectListingButton
        chain={sepolia}
        client={client}
        contractAddress={marketplaceAddress}
        listingId={1n}
      >
        Buy NFT
      </BuyDirectListingButton>,
    );
    expect(screen.queryByText("Buy NFT")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
