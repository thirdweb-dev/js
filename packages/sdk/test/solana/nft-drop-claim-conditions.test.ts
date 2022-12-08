import { NFTDrop, Token } from "../../src/solana";
import { sdk } from "./before-setup";
import { Keypair, PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("NFTDrop ClaimConditions", async () => {
  let drop: NFTDrop;
  let token: Token;
  let primarySaleRecipient: string;

  before(async () => {
    const address = await sdk.deployer.createNftDrop({
      name: "NFT Drop #1",
      totalSupply: 5,
    });
    const addressToken = await sdk.deployer.createToken({
      name: "Token #1",
      initialSupply: 100,
    });
    drop = await sdk.getNFTDrop(address);
    token = await sdk.getToken(addressToken);
    primarySaleRecipient = Keypair.generate().publicKey.toBase58();
    await token.mintTo(primarySaleRecipient, 1); // only needed to create the token account / TODO expose utility for it
  });

  it("should set claim conditions with custom currency and claim", async () => {
    const metadatas = [...Array(5)].map((_, i) => ({
      name: `NFT #${i + 1}`,
      description: `This is the #${i + 1} NFT`,
    }));
    await drop.lazyMint(metadatas);
    expect((await token.balance()).displayValue).to.eq("100.000000000");
    expect((await token.balanceOf(primarySaleRecipient)).displayValue).to.eq(
      "1.000000000",
    );

    await drop.claimConditions.set({
      maxClaimable: 3,
      currencyAddress: token.publicKey.toBase58(),
      price: 1,
      primarySaleRecipient,
    });
    const addresses = await drop.claim(2);
    expect(addresses.length).to.eq(2);
    expect((await token.balance()).displayValue).to.eq("98.000000000");
    expect((await token.balanceOf(primarySaleRecipient)).displayValue).to.eq(
      "3.000000000",
    );
    expect(await drop.balance(addresses[0])).to.eq(1);
    expect(await drop.balance(addresses[1])).to.eq(1);
  });
});
