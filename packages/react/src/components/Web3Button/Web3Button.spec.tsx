import { Web3Button } from ".";
import { ThirdwebProvider } from "../..";
import { test, expect } from "@playwright/experimental-ct-react";

test.use({ viewport: { width: 500, height: 500 } });

test("should render the connect wallet button", async ({ mount }) => {
  const component = await mount(
    <ThirdwebProvider desiredChainId={1}>
      <Web3Button contractAddress="0x123" action={() => undefined}>
        Do the thing
      </Web3Button>
    </ThirdwebProvider>,
  );
  await expect(component).toContainText("Connect Wallet");
});
