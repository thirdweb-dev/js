import { CONTRACT_ADDRESSES } from "./CONTRACT_ADDRESSES";
import { ChainId } from "../chains/ChainId";
import { SUPPORTED_CHAIN_ID } from "../chains/SUPPORTED_CHAIN_ID";
import { AddressZero } from "./AddressZero";

/**
 * @internal
 */
export function getContractAddressByChainId(
  chainId: SUPPORTED_CHAIN_ID | ChainId.Hardhat,
  contractName: keyof (typeof CONTRACT_ADDRESSES)[SUPPORTED_CHAIN_ID],
): string | undefined {
  // for testing only
  if (chainId === ChainId.Hardhat || chainId === ChainId.Localhost) {
    if (contractName === "twFactory") {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      return process.env.factoryAddress as string;
    } else if (contractName === "twRegistry") {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      return process.env.registryAddress as string;
    } else {
      return AddressZero;
    }
  }
  // real output here
  return CONTRACT_ADDRESSES[chainId]?.[contractName];
}
