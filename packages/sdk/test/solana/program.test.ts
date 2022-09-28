import { sdk } from "./before-setup";
import { BigNumber } from "@metaplex-foundation/js";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";
import { readFileSync } from "fs";

describe("Programs", async () => {
  it("call and fetch", async () => {
    const program = await sdk.getProgramWithIdl(
      "89RsF5yJgRXhae6LKuCcMRgXkqxCJm3AeaYwcJN4XopA",
      JSON.parse(readFileSync("test/solana/data/counter_idl.json", "utf-8")),
    );
    const counterAccount = Keypair.generate();
    const counterAccountAddress = counterAccount.publicKey.toBase58();
    const signerAddress = sdk.wallet.getAddress() || "";

    await program.call("initialize", {
      accounts: {
        counterAccount: counterAccountAddress,
        authority: signerAddress,
      },
      signers: [counterAccount],
    });

    await program.call("increment", {
      accounts: {
        counterAccount: counterAccountAddress,
        authority: signerAddress,
      },
    });

    const count = await program.fetch("counterAccount", counterAccountAddress);
    expect((count.count as BigNumber).toNumber()).to.eq(1);
  });
});
