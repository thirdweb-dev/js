import type { Signer } from "ethers6";
import type { WalletClient } from "viem";
import { ethers6Adapter } from "../../adapters/ethers6.js";
import { viemAdapter } from "../../adapters/viem.js";
import type { Account, AnyAccount } from "../interfaces/wallet.js";

function isViem(anyAccount: AnyAccount): anyAccount is WalletClient {
  return "account" in anyAccount;
}

function isEthers6(anyAccount: AnyAccount): anyAccount is Signer {
  return "provider" in anyAccount;
}

export async function convertAccount(anyAccount: AnyAccount): Promise<Account> {
  if (isViem(anyAccount)) {
    return viemAdapter.walletClient.fromViem({ walletClient: anyAccount });
  } else if (isEthers6(anyAccount)) {
    return ethers6Adapter.signer.fromEthers({ signer: anyAccount });
  } else {
    return anyAccount as Account;
  }
}
