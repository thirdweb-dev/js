import { ThirdwebSDK } from "../sdk";
import { Network } from "../types/index";
import { getPayer } from "./local-config";
import { KeypairSigner } from "@metaplex-foundation/js";

export function createThirdwebSDK(network: Network): ThirdwebSDK {
  const payer = getPayer();
  const signer: KeypairSigner = {
    publicKey: payer.publicKey,
    secretKey: payer.secretKey,
  };
  const sdk = ThirdwebSDK.fromNetwork(network);
  sdk.wallet.connect(signer);
  return sdk;
}
