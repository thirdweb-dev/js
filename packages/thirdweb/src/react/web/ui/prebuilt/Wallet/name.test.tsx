import { describe, expect, it } from "vitest";
import { render, waitFor } from "~test/react-render.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { WalletName, fetchWalletName, getQueryKeys } from "./name.js";
import { WalletProvider } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("WalletName", () => {
  it("fetchWalletName: should fetch wallet name from id", async () => {
    const name = await fetchWalletName({ id: "io.metamask" });
    expect(name).toBe("MetaMask");
  });

  it("fetchWalletName should throw error if failed to get name", async () => {
    // @ts-ignore for test
    await expect(() => fetchWalletName({ id: "test___" })).rejects.toThrowError(
      "Wallet with id test___ not found",
    );
  });

  it("fetchWalletName should work with formatFn", async () => {
    const formatFn = (str: string) => `${str} Wallet`;
    expect(await fetchWalletName({ id: "io.metamask", formatFn })).toBe(
      "MetaMask Wallet",
    );
  });

  it("getQueryKeys should work without a formatFn", () => {
    expect(getQueryKeys({ id: "ai.hacken" })).toStrictEqual([
      "walletName",
      "ai.hacken",
    ]);
  });

  it("getQueryKeys should work WITH a formatFn", () => {
    const fn = (str: string) => `test:${str}`;
    const fnId = getFunctionId(fn);
    expect(getQueryKeys({ id: "ai.hacken", formatFn: fn })).toStrictEqual([
      "walletName",
      "ai.hacken",
      { resolver: fnId },
    ]);
  });

  it("should render a span", async () => {
    const { container } = render(
      <WalletProvider id="io.metamask">
        <WalletName />
      </WalletProvider>,
    );

    await waitFor(() => {
      expect(container.querySelector("span")).not.toBe(null);
    });
  });
});
