import { Token } from "../../src/solana";
import { sdk } from "./before-setup";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("Token", async () => {
  let token: Token;

  before(async () => {
    const tokenAddr = await sdk.deployer.createToken({
      name: "My Token",
      symbol: "MTK",
      initialSupply: 100,
    });
    token = await sdk.getToken(tokenAddr);
  });

  it("fetch metadata", async () => {
    const meta = await token.getMetadata();
    expect(meta.name).to.eq("My Token");
  });

  it("mint more should update total supply", async () => {
    expect((await token.totalSupply()).displayValue).to.eq("100.000000000");
    await token.mint(3);
    expect((await token.totalSupply()).displayValue).to.eq("103.000000000");
  });

  it("transfer should update total supply", async () => {
    expect((await token.balance()).displayValue).to.eq("103.000000000");
    const receiver = Keypair.generate();
    await token.transfer(receiver.publicKey.toBase58(), 10);
    expect((await token.balance()).displayValue).to.eq("93.000000000");
  });
});
