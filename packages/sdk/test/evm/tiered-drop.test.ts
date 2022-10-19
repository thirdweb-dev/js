import { SmartContract } from "../../src/evm/contracts/smart-contract";
import { sdk } from "./before-setup";
import { expect } from "chai";

describe.skip("Tiered Drop Contract", async () => {
  let contract: SmartContract;

  before(async () => {
    const address = "";
    contract = await sdk.getContract(address);
  });

  it("Should lazy mint NFTs", async () => {
    const metadata = [
      {
        name: "NFT #1",
        description: "My first NFT",
      },
      {
        name: "NFT #2",
        description: "My second NFT",
      },
    ];
    const txs = await contract.erc721.tieredDrop.lazyMintWithTier(
      metadata,
      "tier1",
    );
    expect(txs.length).to.equal(2);
    const nft = await txs[0].data();
    expect(nft.name).to.equal("NFT #1");

    const nfts = await contract.erc721.tieredDrop.getTokensInTier("tier1");
    expect(nfts.length).to.equal(2);
    expect(nfts[0].metadata.name).to.equal("NFT #1");
  });
});
