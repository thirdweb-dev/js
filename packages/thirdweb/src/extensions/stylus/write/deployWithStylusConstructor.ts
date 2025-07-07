import type { Abi, AbiConstructor } from "abitype";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { FN_SELECTOR } from "../../../extensions/stylus/__generated__/IStylusConstructor/write/stylus_constructor.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import { normalizeFunctionParams } from "../../../utils/abi/normalizeFunctionParams.js";
import { toHex } from "../../../utils/encoding/hex.js";
import { deploy } from "../__generated__/IStylusDeployer/write/deploy.js";

const STYLUS_DEPLOYER = "0xcEcba2F1DC234f70Dd89F2041029807F8D03A990";

export type DeployWithStylusConstructorOptions = {
  chain: Chain;
  client: ThirdwebClient;
  bytecode: `0x${string}`;
  constructorParams: Record<string, unknown>;
  abi: Abi;
};

/**
 * Deploy stylus contract with constructor params
 * @param options - The options deploying contract with constructor
 * @returns Prepared transaction to call stylus deployer
 * @example
 * ```ts
 * import { deployWithStylusConstructor } from "thirdweb/stylus";
 * const transaction = deployWithStylusConstructor({
 *  client,
 *  chain,
 *  bytecode,
 *  constructorParams,
 *  abi
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function deployWithStylusConstructor(
  options: DeployWithStylusConstructorOptions,
) {
  const { chain, client, constructorParams, abi, bytecode } = options;
  const bytecodeHex = bytecode.startsWith("0x")
    ? bytecode
    : (`0x${bytecode}` as `0x${string}`);

  const stylusDeployer = getContract({
    address: STYLUS_DEPLOYER,
    chain,
    client,
  });

  const constructorAbi = abi.find((a) => a.type === "constructor") as
    | AbiConstructor
    | undefined;

  const normalized = normalizeFunctionParams(constructorAbi, constructorParams);
  const constructorCalldata = (FN_SELECTOR +
    encodeAbiParameters(
      constructorAbi?.inputs || [], // Leave an empty array if there's no constructor
      normalized,
    ).slice(2)) as `${typeof FN_SELECTOR}${string}`;

  return deploy({
    bytecode: bytecodeHex,
    contract: stylusDeployer,
    initData: constructorCalldata,
    initValue: 0n,
    salt: toHex(0, { size: 32 }),
  });
}
