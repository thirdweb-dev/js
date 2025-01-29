import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { shortenAddress } from "../../../../../utils/address.js";
import { AccountProvider } from "../../../../core/account/provider.js";
import { AccountAddress } from "./address.js";

describe.runIf(process.env.TW_SECRET_KEY)("AccountAddress component", () => {
  it("should format the address properly", () => {
    render(
      <AccountProvider
        address="0x12345674b599ce99958242b3D3741e7b01841DF3"
        client={TEST_CLIENT}
      >
        <AccountAddress formatFn={shortenAddress} />
      </AccountProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText("0x1234...1DF3", {
          exact: true,
          selector: "span",
        }),
      ).toBeInTheDocument(),
    );
  });
});
