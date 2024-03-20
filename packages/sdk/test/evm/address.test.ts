import { sdk } from "./before-setup";
import { expect } from "chai";

describe("Address & ENS", async () => {
  it("Should resolve ENS on deploy", async () => {
    const address = await sdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: "vitalik.eth",
    });
    const contract = await sdk.getContract(address);
    expect((await contract.sales.getRecipient()).toLowerCase()).to.equal(
      "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    );
  });

  it("Should resolve ENS on call", async () => {
    const address = await sdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: "0x0000000000000000000000000000000000000000",
    });
    const contract = await sdk.getContract(address);

    expect(
      (await contract.erc721.balanceOf("vitalik.eth")).toNumber(),
    ).to.equal(0);

    await contract.erc721.mintTo("vitalik.eth", { name: "Test NFT" });

    expect(
      (await contract.erc721.balanceOf("vitalik.eth")).toNumber(),
    ).to.equal(1);
    expect(
      (
        await contract.erc721.balanceOf(
          "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        )
      ).toNumber(),
    ).to.equal(1);
  });

  it.skip("Should resolve cb.id", async () => {
    const address = await sdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: "aneriamin.cb.id",
    });
    const contract = await sdk.getContract(address);
    expect((await contract.sales.getRecipient()).toLowerCase()).to.equal(
      "0xede3a75aca635c531b6198c230f3da67949678fe",
    );
  });

  it("Should resolve ENS subdomains", async () => {
    const address = await sdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: "deployer.thirdweb.eth",
    });
    const contract = await sdk.getContract(address);
    expect((await contract.sales.getRecipient()).toLowerCase()).to.equal(
      "0xdd99b75f095d0c4d5112ace938e4e6ed962fb024",
    );
  });
});
