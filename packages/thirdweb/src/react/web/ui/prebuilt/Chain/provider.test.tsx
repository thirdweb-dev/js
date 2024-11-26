import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { ChainName } from "./name.js";
import { ChainProvider } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("ChainProvider component", () => {
  it("should render children correctly", () => {
    render(
      <ChainProvider chain={ethereum}>
        <div>Child Component</div>
      </ChainProvider>,
    );

    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("should pass the chain correctly to the children props", () => {
    render(
      <ChainProvider chain={ethereum}>
        <ChainName />
      </ChainProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText("Ethereum", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });
});
