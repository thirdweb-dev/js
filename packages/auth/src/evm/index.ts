import { ThirdwebAuth } from "../core";
import { LoginPayload, VerifyOptions } from "../core/schema";
import { EthersWallet } from "@thirdweb-dev/wallets/evm/wallets/ethers";
import { ethers } from "ethers";

const authMap = new Map<string, ThirdwebAuth>();
let wallet: EthersWallet;

export async function verifyLogin(
  domain: string,
  payload: LoginPayload,
  options?: Omit<VerifyOptions, "domain">,
) {
  wallet = wallet || new EthersWallet(ethers.Wallet.createRandom());
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

export { PrivateKeyWallet } from "@thirdweb-dev/wallets/evm/wallets/private-key";
