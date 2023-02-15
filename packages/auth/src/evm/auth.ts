import { ThirdwebAuth } from "../core";
import { LoginPayload, VerifyOptions } from "../core/schema";
import { SignerWallet } from "./signer";
import { ethers } from "ethers";

const wallet = new SignerWallet(ethers.Wallet.createRandom());
const authMap = new Map<string, ThirdwebAuth>();

export async function verifyLogin(
  domain: string,
  payload: LoginPayload,
  options?: Omit<VerifyOptions, "domain">,
) {
  let auth: ThirdwebAuth;
  if (!authMap.has(domain)) {
    auth = new ThirdwebAuth(wallet, domain);
    authMap.set(domain, auth);
  } else {
    auth = authMap.get(domain) as ThirdwebAuth;
  }

  try {
    const address = await auth.verify(payload, options);
    return { address, error: undefined };
  } catch (err: any) {
    return { address: undefined, error: err.message };
  }
}
