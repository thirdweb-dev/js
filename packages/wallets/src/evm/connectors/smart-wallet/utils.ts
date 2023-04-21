import {
  ChainOrRpcUrl,
  isContractDeployed,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { EVMWallet } from "../../interfaces";

// TODO: need `accountId` on this object, but don't have it yet
export type AssociatedAccount = { account: string; accountAdmin: string };

export async function getAssociatedAccounts(
  personalWallet: EVMWallet,
  factoryAddress: string,
  chain: ChainOrRpcUrl,
) {
  const personalSigner = await personalWallet.getSigner();
  const readOnlySDK = new ThirdwebSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  // TODO this might not scale for very large factories
  // TODO need to also merge the accounts that have this personalWallet as a secondary signer
  const accounts = await factoryContract.events.getEvents("AccountCreated", {
    filters: {
      accountAdmin: await personalSigner.getAddress(),
    },
  });
  return accounts.map((a) => a.data) as AssociatedAccount[];
}

export async function isAccountIdAvailable(
  accountId: string,
  factoryAddress: string,
  chain: ChainOrRpcUrl,
) {
  const readOnlySDK = new ThirdwebSDK(chain);
  const factoryContract = await readOnlySDK.getContract(factoryAddress);
  const accountAddress = await factoryContract.call("getAddress", [
    getEncodedAccountId(accountId),
  ]);
  const isDeployed = await isContractDeployed(
    accountAddress,
    readOnlySDK.getProvider(),
  );
  return !isDeployed;
}

export function getEncodedAccountId(accountId: string) {
  const hash = ethers.utils.id(accountId);
  const salt = "0x" + hash.substring(2, 66);
  return salt;
}
