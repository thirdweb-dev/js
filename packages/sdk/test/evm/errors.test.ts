import { sdk } from "./before-setup";
import { expect } from "chai";
import { ethers } from "ethers";

describe("Error Handling", async () => {
  it("should throw proper error on no gas", async () => {
    sdk.updateSignerOrProvider(
      ethers.Wallet.createRandom().connect(sdk.getProvider()),
    );

    try {
      await sdk.deployer.deployNFTCollection({
        name: "Should Fail Collection",
        primary_sale_recipient: "0x0000000000000000000000000000000000000000",
      });
      // expect.fail();
    } catch (err) {
      expect(err.message).to.contain(
        "You have insufficient funds in your account to execute this transaction.",
      );
    }
  });
});
