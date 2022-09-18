import {
  CANDYMACHINE_PROGRAM_ID,
  METAPLEX_PROGRAM_ID,
} from "../src/constants/addresses";
import { ThirdwebSDK } from "../src/sdk";
import { MockStorage } from "./mock/MockStorage";
import { Amman } from "@metaplex-foundation/amman-client";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";

export const createTestSDK = async (
  solsToAirdrop: number = 100,
): Promise<ThirdwebSDK> => {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const sdk = new ThirdwebSDK(connection, new MockStorage());
  const wallet = Keypair.generate();
  const amman = Amman.instance({
    knownLabels: {
      [METAPLEX_PROGRAM_ID]: "Token Metadata",
      [TOKEN_PROGRAM_ID.toBase58()]: "Token",
      [CANDYMACHINE_PROGRAM_ID]: "Candy Machine",
      "89RsF5yJgRXhae6LKuCcMRgXkqxCJm3AeaYwcJN4XopA": "Counter Program",
    },
  });
  await amman.airdrop(connection, wallet.publicKey, solsToAirdrop);
  sdk.wallet.connect(wallet);
  return sdk;
};

let sdk: ThirdwebSDK;

before(async () => {
  sdk = await createTestSDK();
});

export { sdk };
