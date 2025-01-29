import { describe, expect, it } from "vitest";
import { render, screen } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { AccountAddress } from "../../web/ui/prebuilt/Account/address.js";
import { AccountProvider } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("AccountProvider component", () => {
  it("should render children correctly", () => {
    render(
      <AccountProvider
        address="0x12345674b599ce99958242b3D3741e7b01841DF3"
        client={TEST_CLIENT}
      >
        <div>Child Component</div>
      </AccountProvider>,
    );

    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("should pass the address correctly to the children props", () => {
    render(
      <AccountProvider
        address="0x12345674b599ce99958242b3D3741e7b01841DF3"
        client={TEST_CLIENT}
      >
        <AccountAddress />
      </AccountProvider>,
    );

    expect(
      screen.getByText("0x12345674b599ce99958242b3D3741e7b01841DF3", {
        exact: true,
        selector: "span",
      }),
    ).toBeInTheDocument();
  });

  it("should throw an error if no address is provided", () => {
    expect(() => {
      render(
        <AccountProvider
          // biome-ignore lint/suspicious/noExplicitAny: testing invalid input
          address={undefined as any}
          client={TEST_CLIENT}
        >
          <AccountAddress />
        </AccountProvider>,
      );
    }).toThrowError(
      "AccountProvider: No address passed. Ensure an address is always provided to the AccountProvider",
    );
  });
});
