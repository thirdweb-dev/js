import { ThirdwebSDK } from "../sdk";
import { Network } from "../types/index";
import { getPayer } from "./local-config";
import { KeypairSigner } from "@metaplex-foundation/js";
import { IpfsStorage, IStorage } from "@thirdweb-dev/storage";

export function createThirdwebSDK(
  network: Network,
  storage: IStorage = new IpfsStorage(),
): ThirdwebSDK {
  const payer = getPayer();
  const signer: KeypairSigner = {
    publicKey: payer.publicKey,
    secretKey: payer.secretKey,
  };
  const sdk = ThirdwebSDK.fromNetwork(network, storage);
  sdk.wallet.connect(signer);
  return sdk;
}
