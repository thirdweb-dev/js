import { sdk } from "./before-setup";
import { Keypair } from "@solana/web3.js";
import { readFileSync } from "fs";

describe("Programs", async () => {
  it("call and fetch", async () => {
    // const program = await sdk.getProgramWithIdl(
    //   "89RsF5yJgRXhae6LKuCcMRgXkqxCJm3AeaYwcJN4XopA",
    //   JSON.parse(readFileSync("test/data/counter_idl.json", "utf-8")),
    // );
    const program = await sdk.getProgram(
      "89RsF5yJgRXhae6LKuCcMRgXkqxCJm3AeaYwcJN4XopA",
    );
    const counterAccount = Keypair.generate();
    const counterAccountAddress = counterAccount.publicKey.toBase58();
    console.log("counterAccountAddress", counterAccountAddress);
    const signerAddress = sdk.wallet.getAddress() || "";
    console.log("signerAddress", signerAddress);
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
    console.log(count);
  });
});
