import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { defineChain } from "../../../../../chains/utils.js";
import { ChainName, fetchChainName } from "./name.js";
import { ChainProvider } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("ChainName component", () => {
  it("should return the correct chain name, if the name exists in the chain object", async () => {
    render(
      <ChainProvider chain={ethereum}>
        <ChainName />
      </ChainProvider>,
    );
    await waitFor(() =>
      expect(
        screen.getByText("Ethereum", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should return the correct chain name, if the name is loaded from the server", async () => {
    render(
      <ChainProvider chain={defineChain(1)}>
        <ChainName />
      </ChainProvider>,
    );
    await waitFor(() =>
      expect(
        screen.getByText("Ethereum Mainnet", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should return the correct FORMATTED chain name", async () => {
    render(
      <ChainProvider chain={ethereum}>
        <ChainName formatFn={(str: string) => `${str}-formatted`} />
      </ChainProvider>,
    );
    await waitFor(() =>
      expect(
        screen.getByText("Ethereum-formatted", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should fallback properly when fail to resolve chain name", async () => {
    render(
      <ChainProvider chain={defineChain(-1)}>
        <ChainName fallbackComponent={<span>oops</span>} />
      </ChainProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByText("oops", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("fetchChainName should respect nameResolver as a string", async () => {
    const res = await fetchChainName({
      chain: ethereum,
      nameResolver: "eth_mainnet",
    });
    expect(res).toBe("eth_mainnet");
  });

  it("fetchChainName should respect nameResolver as a non-async function", async () => {
    const res = await fetchChainName({
      chain: ethereum,
      nameResolver: () => "eth_mainnet",
    });
    expect(res).toBe("eth_mainnet");
  });

  it("fetchChainName should respect nameResolver as an async function", async () => {
    const res = await fetchChainName({
      chain: ethereum,
      nameResolver: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return "eth_mainnet";
      },
    });
    expect(res).toBe("eth_mainnet");
  });
});
