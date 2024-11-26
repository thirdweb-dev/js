import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { TokenName } from "./name.js";
import { TokenProvider } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("TokenProvider component", () => {
  it("should render children correctly", () => {
    render(
      <TokenProvider
        address={NATIVE_TOKEN_ADDRESS}
        client={TEST_CLIENT}
        chain={ethereum}
      >
        <div>Child Component</div>
      </TokenProvider>,
    );

    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("should pass the token data correctly to the children props", () => {
    render(
      <TokenProvider
        address={NATIVE_TOKEN_ADDRESS}
        client={TEST_CLIENT}
        chain={ethereum}
      >
        <TokenName />
      </TokenProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText("Ether", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });
});
