import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { defineChain } from "../../../../../chains/utils.js";
import { ChainName } from "./name.js";
import { ChainProvider } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("ChainName component", () => {
  it("should return the correct chain name, if the name exists in the chain object", () => {
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

  it("should return the correct chain name, if the name is loaded from the server", () => {
    render(
      <ChainProvider chain={defineChain(1)}>
        <ChainName />
      </ChainProvider>,
    );
    waitFor(() =>
      expect(
        screen.getByText("Ethereum Mainnet", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should return the correct FORMATTED chain name", () => {
    render(
      <ChainProvider chain={ethereum}>
        <ChainName formatFn={(str: string) => `${str}-formatted`} />
      </ChainProvider>,
    );
    waitFor(() =>
      expect(
        screen.getByText("Ethereum-formatted", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should fallback properly when fail to resolve chain name", () => {
    render(
      <ChainProvider chain={defineChain(-1)}>
        <ChainName fallbackComponent={<span>oops</span>} />
      </ChainProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText("oops", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });
});
