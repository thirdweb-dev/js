import { ThirdwebAuth } from "../core";
import { LoginPayload, VerifyOptions } from "../core/schema";
import { SignerWallet } from "./signer";
import { ethers } from "ethers";

const wallet = new SignerWallet(ethers.Wallet.createRandom());
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
