import { parseAbi } from "abitype";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import {
  PUBLISHED_PRIVATE_KEY,
  singletonFactoryAbi,
  singletonFactoryBytecode,
  ZKSYNC_SINGLETON_FACTORY,
} from "../../../utils/any-evm/zksync/constants.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { toWei } from "../../../utils/units.js";
import { privateKeyToAccount } from "../../../wallets/private-key.js";
import { getWalletBalance } from "../../../wallets/utils/getWalletBalance.js";
import { zkDeployContract } from "./zkDeployContract.js";

/**
 * @internal
 */
export async function zkDeployCreate2Factory(
  options: ClientAndChainAndAccount,
) {
  const isDeployed = await isContractDeployed({
    address: ZKSYNC_SINGLETON_FACTORY,
    chain: options.chain,
    client: options.client,
  });

  if (isDeployed) {
    return ZKSYNC_SINGLETON_FACTORY;
  }

  if (!PUBLISHED_PRIVATE_KEY) {
    throw new Error(
      `Unable to deploy create2 factory on chain ${options.chain.id} - please contact us via https://thirdweb.com/support to enable this chain`,
    );
  }

  const create2Signer = privateKeyToAccount({
    client: options.client,
    privateKey: PUBLISHED_PRIVATE_KEY,
  });

  const valueToSend = toWei("0.01");
  const balance = await getWalletBalance({
    address: create2Signer.address,
    chain: options.chain,
    client: options.client,
  });

  if (balance.value < valueToSend) {
    await sendAndConfirmTransaction({
      account: options.account,
      transaction: prepareTransaction({
        chain: options.chain,
        client: options.client,
        to: create2Signer.address,
        value: valueToSend,
      }),
    });
  }

  await zkDeployContract({
    abi: parseAbi(singletonFactoryAbi),
    account: create2Signer,
    bytecode: singletonFactoryBytecode,
    chain: options.chain,
    client: options.client,
    deploymentType: "create2",
  });

  return ZKSYNC_SINGLETON_FACTORY;
}
