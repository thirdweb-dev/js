import { METAPLEX_PROGRAM_ID } from "../src/constants/addresses";
import { NFTCollection } from "../src/contracts/nft-collection";
import { ThirdwebSDK } from "../src/sdk";
import { MockStorage } from "./mock/MockStorage";
import { Amman } from "@metaplex-foundation/amman-client";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";
import { expect } from "chai";

const createTestSDK = async (
  solsToAirdrop: number = 100,
): Promise<ThirdwebSDK> => {
  const connection = new Connection("http://localhost:8899");
  const sdk = new ThirdwebSDK(connection, new MockStorage());
  const wallet = Keypair.generate();
  const amman = Amman.instance({
    knownLabels: {
      [METAPLEX_PROGRAM_ID]: "Token Metadata",
      [TOKEN_PROGRAM_ID.toBase58()]: "Token",
    },
  });
  await amman.airdrop(connection, wallet.publicKey, solsToAirdrop);
  sdk.wallet.connect(wallet);
  return sdk;
};

describe("NFTCollection", async () => {
  let sdk: ThirdwebSDK;
  let collection: NFTCollection;

  before(async () => {
    sdk = await createTestSDK();
    const addr = await sdk.deployer.createNftCollection({
      name: "Test Collection",
      description: "Test Description",
      symbol: "TC",
    });
    collection = await sdk.getNFTCollection(addr);
  });

  it("test", async () => {
    const token = await sdk.deployer.createToken({
      name: "My Token",
      initialSupply: 100,
    });
    console.log(token);
  });

  it("should mint an NFT", async () => {
    const mint = await collection.mint({
      name: "Test NFT",
      description: "Test Description",
    });
    expect(mint.name).to.eq("Test NFT");
  });

  it("should fetch NFTs", async () => {
    const all = await collection.getAll();
    expect(all.length).to.eq(1);
    const single = await collection.get(all[0]);
    expect(single.name).to.eq("Test NFT");
  });

  it("should fetch balance of NFTs", async () => {
    const all = await collection.getAll();
    const balance = await collection.balanceOf(
      sdk.wallet.getAddress() || "",
      all[0],
    );
    expect(balance).to.eq(1n);
  });

  it("should transfer NFTs", async () => {
    const all = await collection.getAll();
    const wallet = Keypair.generate();
    await collection.transfer(wallet.publicKey.toBase58() || "", all[0]);
    const balance = await collection.balanceOf(
      wallet.publicKey.toBase58() || "",
      all[0],
    );
    expect(balance).to.eq(1n);
    const balance2 = await collection.balanceOf(
      sdk.wallet.getAddress() || "",
      all[0],
    );
    expect(balance2).to.eq(0n);
  });
});
