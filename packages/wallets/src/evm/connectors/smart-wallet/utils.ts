import {
  ChainOrRpcUrl,
  isContractDeployed,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { EVMWallet } from "../../interfaces";

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
  console.log(
    `Found ${accounts.length} accounts for personalWallet`,
    accounts.map((a) => a.data),
  );
  return accounts.map((a) => a.data);
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
