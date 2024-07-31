import { describe, expect, it } from "vitest";
import { render, screen } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { avalancheFuji } from "../../../../../../chains/chain-definitions/avalanche-fuji.js";
import { StakeERC1155Button } from "./index.js";

const client = TEST_CLIENT;

// stake erc1155 contract on avax fuji
const stakeAddress = "0x03b43a95a242bFF51EF6e68712f3675A1e243182";

describe.runIf(process.env.TW_SECRET_KEY)("StakeERC721Button", () => {
  it("should render", () => {
    render(
      <StakeERC1155Button
        client={client}
        chain={avalancheFuji}
        contractAddress={stakeAddress}
        tokenId={0n}
        amount={1n}
      >
        Stake NFT
      </StakeERC1155Button>,
    );
    expect(screen.queryByText("Stake NFT")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
