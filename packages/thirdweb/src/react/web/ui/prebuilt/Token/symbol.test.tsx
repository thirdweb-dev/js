import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { TokenProvider } from "./provider.js";
import { TokenSymbol } from "./symbol.js";

describe.runIf(process.env.TW_SECRET_KEY)("TokenSymbol component", () => {
  it("should pass the address correctly to the children props", () => {
    render(
      <TokenProvider
        address={NATIVE_TOKEN_ADDRESS}
        client={TEST_CLIENT}
        chain={ethereum}
      >
        <TokenSymbol />
      </TokenProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText("ETH", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });
});
