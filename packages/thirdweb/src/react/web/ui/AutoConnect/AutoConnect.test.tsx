import { describe, it } from "vitest";
import { render } from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import { AutoConnect } from "./AutoConnect.js";

describe("AutoConnect", () => {
  it("does not break", () => {
    render(
      <AutoConnect
        client={TEST_CLIENT}
        wallets={[createWallet("io.metamask")]}
      />,
    );
  });
});
