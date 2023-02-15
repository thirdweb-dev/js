import { ThirdwebAuth } from "../core";
import { LoginPayload, VerifyOptions } from "../core/schema";
import { KeypairWallet } from "./signer";
import { Keypair } from "@solana/web3.js";

const wallet = new KeypairWallet(Keypair.generate());
const authMap = new Map();

export function verifyLogin(
  domain: string,
  payload: LoginPayload,
  options?: Omit<VerifyOptions, "domain">,
) {
  if (!authMap.has(domain)) {
    authMap.set(domain, new ThirdwebAuth(wallet, domain));
  }

  const auth = authMap.get(domain);
  return auth.verify(payload, options);
}
