/* eslint-disable turbo/no-undeclared-env-vars */
import { ThirdwebSDK } from "../../src/evm";
import { assert } from "chai";
import { ethers, Wallet } from "ethers";

const RPC_URL = "https://rpc-mumbai.maticvigil.com/";

describe("Gasless Forwarder", async () => {
  it.skip("should use sdk with biconomy", async () => {
    const BUNDLE_DROP_ADDRESS = "0xEBed8e37a32660dbCeeeC19cCBb952b7d214f008";
    const provider = ethers.getDefaultProvider(RPC_URL);
    const wallet = Wallet.createRandom().connect(provider);
    const sdk = new ThirdwebSDK(wallet, {
      secretKey: process.env.TW_SECRET_KEY,
      gasless: {
        biconomy: {
          apiKey: process.env.BICONOMY_API_KEY as string,
          apiId: process.env.BICONOMY_API_ID as string,
        },
      },
    });
    const bundleDrop = await sdk.getEditionDrop(BUNDLE_DROP_ADDRESS);
    await bundleDrop.claim("0", 1);
  });

  it.skip("should use sdk with openzeppelin defender", async () => {
    const provider = ethers.getDefaultProvider(RPC_URL);
    const wallet = Wallet.createRandom().connect(provider);
    const sdk = new ThirdwebSDK(wallet, {
      secretKey: process.env.TW_SECRET_KEY,
      gasless: {
        openzeppelin: {
          relayerUrl: "",
        },
      },
    });

    // const nftCollection = await sdk.getNFTCollection(NFT_COLLECTION_ADDRESS);
    // await nftCollection.mintTo("0xEBed8e37a32660dbCeeeC19cCBb952b7d214f008", "uri");

    const pack = await sdk.getPack(
      "0x3A85026217Ca7DA710bf42bbD641991632DAB685",
    );
    await pack.interceptor.overrideNextTransaction(() => ({
      gasLimit: 1234567,
    }));

    await pack.open(0, 0);
  });

  it.skip("should mint batch via multicall tx with relayer", async () => {
    const NFT_COLLECTION_ADDRESS = "0x24A5aB2878B63716B001aa9AbE816c2662192B12";
    const provider = ethers.getDefaultProvider(RPC_URL);
    // const wallet = Wallet.createRandom().connect(provider);
    const wallet = new Wallet("<PRIVATE KEY>", provider);
    const sdk = new ThirdwebSDK(wallet, {
      secretKey: process.env.TW_SECRET_KEY,
      gasless: {
        openzeppelin: {
          relayerUrl: "<RELAYER URL>",
        },
      },
    });

    const nftCollection = await sdk.getContract(
      NFT_COLLECTION_ADDRESS,
      "nft-collection",
    );

    const metas = [
      {
        name: "Test5",
      },
      {
        name: "Test6",
      },
    ];

    const batch = await nftCollection.mintBatch(metas);

    assert.lengthOf(batch, 2);

    for (const meta of metas) {
      const nft = batch.find(
        async (n) => (await n.data()).metadata.name === meta.name,
      );
      assert.isDefined(nft);
    }
  });
});
