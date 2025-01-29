import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { AccountProvider } from "../../../../core/account/provider.js";
import { AccountName } from "./name.js";

describe.runIf(process.env.TW_SECRET_KEY)("AccountName component", () => {
  it("should return the correct social name", () => {
    render(
      <AccountProvider
        address="0x12345674b599ce99958242b3D3741e7b01841DF3"
        client={TEST_CLIENT}
      >
        <AccountName />
      </AccountProvider>,
    );
    waitFor(() =>
      expect(
        screen.getByText("kien-ngo", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should return the correct FORMATTED social name", () => {
    render(
      <AccountProvider
        address="0x12345674b599ce99958242b3D3741e7b01841DF3"
        client={TEST_CLIENT}
      >
        <AccountName formatFn={(str: string) => `${str}-formatted`} />
      </AccountProvider>,
    );
    waitFor(() =>
      expect(
        screen.getByText("kien-ngo-formatted", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });

  it("should fallback properly when fail to resolve social name", () => {
    render(
      <AccountProvider address="invalid-wallet-address" client={TEST_CLIENT}>
        <AccountName fallbackComponent={<span>oops</span>} />
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
});
