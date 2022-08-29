/* eslint-disable turbo/no-undeclared-env-vars */
import { ThirdwebSDK } from "../src";
import { ethers, Wallet } from "ethers";

const RPC_URL = "https://rpc-mumbai.maticvigil.com/";

global.fetch = require("cross-fetch");

describe("Gasless Forwarder", async () => {
  it.skip("should use sdk with biconomy", async () => {
    const BUNDLE_DROP_ADDRESS = "0xEBed8e37a32660dbCeeeC19cCBb952b7d214f008";
    const provider = ethers.getDefaultProvider(RPC_URL);
    const wallet = Wallet.createRandom().connect(provider);
    const sdk = new ThirdwebSDK(wallet, {
      gasless: {
        biconomy: {
          apiKey: process.env.BICONOMY_API_KEY as string,
          apiId: process.env.BICONOMY_API_ID as string,
        },
      },
    });
    const bundleDrop = sdk.getEditionDrop(BUNDLE_DROP_ADDRESS);
    await bundleDrop.claim("0", 1);
  });

  it.skip("should use sdk with openzeppelin defender", async () => {
    const BUNDLE_DROP_ADDRESS = "0x41c1f16fAd38381727b327b26F282C7798ee0655";
    const provider = ethers.getDefaultProvider(RPC_URL);
    const wallet = Wallet.createRandom().connect(provider);
    const sdk = new ThirdwebSDK(wallet, {
      gasless: {
        openzeppelin: {
          relayerUrl: process.env.OZ_DEFENDER_RELAYER_URL as string,
        },
      },
    });
  });
});
