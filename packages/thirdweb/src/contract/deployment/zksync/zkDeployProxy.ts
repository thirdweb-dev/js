import { encode } from "../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import {
  twProxyAbi,
  twProxyBytecode,
} from "../../../utils/any-evm/zksync/constants.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { type ThirdwebContract, getContract } from "../../contract.js";
import { zkDeployContractDeterministic } from "./zkDeployDeterministic.js";

/**
 * @internal
 */
export async function zkDeployProxy(
  options: ClientAndChainAndAccount & {
    cloneFactoryContract: ThirdwebContract;
    initializeTransaction: PreparedTransaction;
    salt?: string;
  },
) {
  // TODO ensure implementation is deployed
  const implementationAddress = await resolvePromisedValue(
    options.initializeTransaction.to,
  );
  if (!implementationAddress) {
    throw new Error("initializeTransaction must have a 'to' field set");
  }
  const deployed = await isContractDeployed(
    getContract({
      address: implementationAddress,
      chain: options.chain,
      client: options.client,
    }),
  );
  if (!deployed) {
    throw new Error(
      `Implementation contract at ${implementationAddress} is not deployed`,
    );
  }
  // deploy tw proxy of the implementation
  const proxyAddress = await zkDeployContractDeterministic({
    client: options.client,
    chain: options.chain,
    account: options.account,
    abi: twProxyAbi,
    bytecode: twProxyBytecode,
    params: {
      _logic: implementationAddress,
      _data: await encode(options.initializeTransaction),
    },
    salt: options.salt || randomBytesHex(32),
  });

  // return address of proxy
  return proxyAddress;
}
