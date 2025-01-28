import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { AccountProvider } from "../../../../core/account/provider.js";
import { AccountAvatar } from "./avatar.js";

describe.runIf(process.env.TW_SECRET_KEY)("AccountAvatar component", () => {
  it("should render an image", () => {
    render(
      <AccountProvider
        address={"0x12345674b599ce99958242b3D3741e7b01841DF3"}
        client={TEST_CLIENT}
      >
        <AccountAvatar />
      </AccountProvider>,
    );

    waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("should fallback properly if failed to load", () => {
    render(
      <AccountProvider address={TEST_ACCOUNT_A.address} client={TEST_CLIENT}>
        <AccountAvatar fallbackComponent={<span>oops</span>} />
      </AccountProvider>,
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

  it("should NOT render anything if fail to resolve avatar", () => {
    render(
      <AccountProvider address={"invalid-wallet-address"} client={TEST_CLIENT}>
        <AccountAvatar />
      </AccountProvider>,
    );

    waitFor(() => expect(screen.getByRole("img")).not.toBeInTheDocument());
  });
});
