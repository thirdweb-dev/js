/** biome-ignore-all lint/nursery/useUniqueElementIds: "id" is not a html attribute here - TODO: stop using 'id' as a prop on JSX elements */
import { describe, expect, it } from "vitest";
import { render, waitFor } from "~test/react-render.js";
import { fetchWalletImage } from "../../../../core/utils/walletIcon.js";
import { WalletProvider } from "../../../../core/wallet/provider.js";
import { SocialIcon, WalletIcon } from "./icon.js";

describe("WalletIcon", () => {
  it("should fetch wallet image", async () => {
    const image = await fetchWalletImage({ id: "io.metamask" });
    expect(image).toContain("data:image/");
  });

  it("should throw error if WalletId is not supported", async () => {
    await expect(
      // @ts-ignore For test
      fetchWalletImage({ id: "__undefined__" }),
    ).rejects.toThrowError("Wallet with id __undefined__ not found");
  });

  it("should render an image", async () => {
    const { container } = render(
      <WalletProvider id="io.cosmostation">
        <WalletIcon />
      </WalletProvider>,
    );
    await waitFor(() => {
      expect(container.querySelector("img")).not.toBe(null);
    });
  });
});

describe("SocialIcon", () => {
  it("should render an image", async () => {
    const { container } = render(<SocialIcon provider="google" />);
    await waitFor(() => {
      expect(container.querySelector("img")).not.toBe(null);
    });
  });
});
