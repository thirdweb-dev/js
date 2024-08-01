import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, waitFor } from "../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { PayEmbed } from "./PayEmbed.js";

describe.runIf(!!process.env.TW_SECRET_KEY)(
  "PayEmbed - Connected state",
  () => {
    it("continue button is disabled if no token amount is set", async () => {
      const { findByRole } = render(<PayEmbed client={TEST_CLIENT} />, {
        setConnectedWallet: true,
      });
      waitFor(async () => {
        const connectWalletButton: HTMLElement = await findByRole("button", {
          name: "Continue",
        });
        // continue button is disabled when no amount is entered
        expect(connectWalletButton).toBeDisabled();
        // user enters an amount
        const tokenInput = await findByRole("textbox");
        await userEvent.type(tokenInput, "1");

        // continue button is enabled
        expect(connectWalletButton).not.toBeDisabled();

        // user clears the amount
        await userEvent.clear(tokenInput);

        // continue button is disabled again
        expect(connectWalletButton).toBeDisabled();
      });
    });
  },
);
