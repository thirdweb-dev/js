import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Transactions", async () => {
  let adminWallet: SignerWithAddress;
  let samWallet: SignerWithAddress;

  before(async () => {
    [adminWallet, samWallet] = signers;
  });

  it("Should succesfully prepare and execute a transaction", async () => {
    const address = await sdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: adminWallet.address,
    });
    const contract = await sdk.getContract(address, "nft-collection");

    let isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(false);

    const tx = await contract.prepare("setApprovalForAll", [
      samWallet.address,
      true,
    ]);
    await tx.execute();

    isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(true);
  });
});
