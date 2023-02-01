import { KeypairWallet } from "./keypair";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export class PrivateKeyWallet extends KeypairWallet {
  constructor(privateKey: string) {
    super(Keypair.fromSecretKey(bs58.decode(privateKey)));
  }
}
