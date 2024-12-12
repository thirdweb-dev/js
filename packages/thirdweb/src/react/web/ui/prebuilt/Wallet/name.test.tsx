import { describe, expect, it, vi } from "vitest";
import { fetchWalletName } from "./name.js";

vi.mock("./WalletName", () => ({
  useWalletName: vi.fn(),
}));

describe.runIf(process.env.TW_SECRET_KEY)("WalletName", () => {
  it("fetchWalletName: should fetch wallet name from id", async () => {
    const name = await fetchWalletName({ id: "io.metamask" });
    expect(name).toBe("MetaMask");
  });
});
