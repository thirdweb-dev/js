import { describe, expect, it } from "vitest";
import { render } from "../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { PayEmbed } from "./PayEmbed.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "PayEmbed: Disconnected state",
  () => {
    it("renders a connect wallet button when a wallet is not connected", async () => {
      const { findByText } = render(<PayEmbed client={TEST_CLIENT} />);
      const connectWalletButton = await findByText("Connect Wallet");
      expect(connectWalletButton).toBeInTheDocument();
    });
  },
);
