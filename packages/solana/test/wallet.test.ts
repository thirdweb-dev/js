import { sdk } from "./before-setup";
import { expect } from "chai";

describe("Wallet", async () => {
  it("balance", async () => {
    const balance = await sdk.wallet.getBalance();
    expect(balance.displayValue).to.eq("100.000000000");
  });
});
