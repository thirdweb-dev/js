import { describe, expect, it } from "vitest";
import { render, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { defineChain } from "../../../../../chains/utils.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { ChainIcon, fetchChainIcon, getQueryKeys } from "./icon.js";
import { ChainProvider } from "./provider.js";

const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("ChainIcon", () => {
  it("fetchChainIcon should respect iconResolver as a string", async () => {
    expect(
      await fetchChainIcon({ chain: ethereum, client, iconResolver: "test" }),
    ).toBe("test");
  });

  it("fetchChainIcon should respect iconResolver as a non-async function", async () => {
    expect(
      await fetchChainIcon({
        chain: ethereum,
        client,
        iconResolver: () => "test",
      }),
    ).toBe("test");
  });

  it("fetchChainIcon should respect iconResolver as an async function", async () => {
    expect(
      await fetchChainIcon({
        chain: ethereum,
        client,
        iconResolver: async () => "test",
      }),
    ).toBe("test");
  });

  it("fetchChainIcon should return a resolved url from the backend server, NOT ipfs uri", async () => {
    const resolvedUrl = await fetchChainIcon({ chain: ethereum, client });
    expect(
      resolvedUrl.includes("QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9"),
    ).toBe(true);
    expect(resolvedUrl.startsWith("https://")).toBe(true);
  });

  it("fetchChainIcon should return a resolved url from the chain object, NOT the ipfs uri", async () => {
    const mockEthereum = defineChain({
      blockExplorers: [
        {
          name: "Etherscan",
          url: "https://etherscan.io",
        },
      ],
      icon: {
        format: "png",
        height: 100,
        url: "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        width: 100,
      },
      id: 1,
      name: "Ethereum",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
    });
    const resolvedUrl = await fetchChainIcon({ chain: mockEthereum, client });
    expect(
      resolvedUrl.endsWith(
        ".ipfscdn.io/ipfs/QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
      ),
    ).toBe(true);
    expect(resolvedUrl.startsWith("https://")).toBe(true);
  });

  it("fetchChainIcon should throw error if failed to resolve chain icon", async () => {
    await expect(
      fetchChainIcon({ chain: defineChain(-1), client }),
    ).rejects.toThrowError("Failed to resolve icon for chain");
  });

  it("getQueryKeys should work without resolver", () => {
    expect(getQueryKeys({ chainId: 1 })).toStrictEqual([
      "_internal_chain_icon_",
      1,
      {
        resolver: undefined,
      },
    ]);
  });

  it("getQueryKeys should work with resolver being a string", () => {
    expect(getQueryKeys({ chainId: 1, iconResolver: "tw" })).toStrictEqual([
      "_internal_chain_icon_",
      1,
      {
        resolver: "tw",
      },
    ]);
  });

  it("getQueryKeys should work with resolver being a non-async fn that returns a string", () => {
    const fn = () => "tw";
    const fnId = getFunctionId(fn);
    expect(getQueryKeys({ chainId: 1, iconResolver: fn })).toStrictEqual([
      "_internal_chain_icon_",
      1,
      {
        resolver: fnId,
      },
    ]);
  });

  it("getQueryKeys should work with resolver being an async fn that returns a string", () => {
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return "tw";
    };
    const fnId = getFunctionId(fn);
    expect(
      getQueryKeys({
        chainId: 1,
        iconResolver: fn,
      }),
    ).toStrictEqual([
      "_internal_chain_icon_",
      1,
      {
        resolver: fnId,
      },
    ]);
  });

  it("should render an image", async () => {
    const { container } = render(
      <ChainProvider chain={ethereum}>
        <ChainIcon client={client} />
      </ChainProvider>,
    );
    await waitFor(() => {
      const image = container.querySelector("img");
      expect(image).toBeTruthy();
      expect(
        image?.src.includes("QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9"),
      ).toBe(true);
    });
  });
});
