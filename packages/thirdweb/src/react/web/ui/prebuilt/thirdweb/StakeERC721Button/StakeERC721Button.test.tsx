import { describe, expect, it } from "vitest";
import { render, screen } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { avalancheFuji } from "../../../../../../chains/chain-definitions/avalanche-fuji.js";
import { StakeERC721Button } from "./index.js";

const client = TEST_CLIENT;

// stake erc721 contract on avax fuji
const stakeAddress = "0x63d4a5eA439e2CcFeEd8e630774AAf4B525677B1";

describe.runIf(process.env.TW_SECRET_KEY)("StakeERC721Button", () => {
  it("should render", () => {
    render(
      <StakeERC721Button
        client={client}
        chain={avalancheFuji}
        contractAddress={stakeAddress}
        tokenIds={[0n]}
      >
        Stake NFT
      </StakeERC721Button>,
    );
    expect(screen.queryByText("Stake NFT")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
