import { ThirdwebSDK } from "../../src/solana";
import { MockStorage } from "./mock/MockStorage";
import { Amman } from "@metaplex-foundation/amman-client";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";

export const createTestSDK = async (
  solsToAirdrop: number = 100,
): Promise<ThirdwebSDK> => {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const sdk = new ThirdwebSDK(connection, MockStorage());
  const wallet = Keypair.generate();
  const amman = Amman.instance({
    knownLabels: {
      metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s: "Token Metadata",
      [TOKEN_PROGRAM_ID.toBase58()]: "Token",
      cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ: "Candy Machine",
      "89RsF5yJgRXhae6LKuCcMRgXkqxCJm3AeaYwcJN4XopA": "Counter Program",
    },
  });
  await amman.airdrop(connection, wallet.publicKey, solsToAirdrop);
  sdk.wallet.connect(wallet);
  return sdk;
};

let sdk: ThirdwebSDK;

export const mochaHooks = {
  beforeAll: async () => {
    sdk = await createTestSDK();
  },
};

export { sdk };
