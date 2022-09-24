import { UserWallet } from "../../sdk/src";
import { sdk } from "./before-setup";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("Wallet", async () => {
  it("balance", async () => {
    const balance = await sdk.wallet.getBalance();
    console.log("balance", balance);
    //expect(balance.displayValue).to.eq("My Token");
  });
});
