import { ThirdwebAuth } from "../core";
import { LoginPayload, VerifyOptions } from "../core/schema";
import { Keypair } from "@solana/web3.js";
import { KeypairWallet } from "@thirdweb-dev/wallets/solana/wallets/keypair";

const authMap = new Map<string, ThirdwebAuth>();
let wallet: KeypairWallet;

export async function verifyLogin(
  domain: string,
  payload: LoginPayload,
  options?: Omit<VerifyOptions, "domain">,
) {
  wallet = wallet || new KeypairWallet(Keypair.generate());
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
