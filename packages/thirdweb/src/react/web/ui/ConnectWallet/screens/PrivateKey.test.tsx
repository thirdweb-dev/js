import { describe, expect, it } from "vitest";
import { render } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import en from "../locale/en.js";
import { PrivateKey } from "./PrivateKey.js";

const client = TEST_CLIENT;

describe("PrivateKey screen", () => {
  it("should render the iframe", () => {
    const { container } = render(
      <PrivateKey
        client={client}
        connectLocale={en}
        onBack={() => {}}
        theme="dark"
        wallet={createWallet("io.metamask")}
      />,
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBe(null);
  });

  it("should throw an error if no wallet is specified", () => {
    expect(() =>
      render(
        <PrivateKey
          client={client}
          connectLocale={en}
          onBack={() => {}}
          theme="dark"
        />,
      ),
    ).toThrowError("[PrivateKey] No wallet found");
  });

  it("should render the modal title", () => {
    const { container } = render(
      <PrivateKey
        client={client}
        connectLocale={en}
        onBack={() => {}}
        theme="dark"
        wallet={createWallet("io.metamask")}
      />,
    );

    const element = container.querySelector("h2");
    expect(element).not.toBe(null);
    expect(element?.innerHTML).toBe(en.manageWallet.exportPrivateKey);
  });
});
