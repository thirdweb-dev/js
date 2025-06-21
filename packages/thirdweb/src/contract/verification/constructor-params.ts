import type * as ox__Abi from "ox/Abi";
import * as ox__AbiConstructor from "ox/AbiConstructor";
import * as ox__AbiParameters from "ox/AbiParameters";
import { eth_getTransactionByHash } from "../../rpc/actions/eth_getTransactionByHash.js";
import { getRpcClient } from "../../rpc/rpc.js";
import type { ThirdwebContract } from "../contract.js";
import { fetchDeployBytecodeFromPublishedContractMetadata } from "../deployment/publisher.js";
import { computeCreate2FactoryAddress } from "../deployment/utils/create-2-factory.js";

type FetchConstructorParamsOptions = {
  contract: ThirdwebContract;
  explorerApiUrl: string;
  explorerApiKey: string;
  abi: ox__Abi.Abi;
};

const RequestStatus = {
  NOTOK: "0",
  OK: "1",
};

/**
 *
 * @param options
 * @example
 * @internal
 */
export async function fetchConstructorParams(
  options: FetchConstructorParamsOptions,
): Promise<string> {
  const abiConstructor = ox__AbiConstructor.fromAbi(options.abi);
  const constructorParamTypes = ox__AbiParameters.from(abiConstructor.inputs);
  if (constructorParamTypes.length === 0) {
    return "";
  }
  const res = await fetch(
    `${options.explorerApiUrl}?module=contract&action=getcontractcreation&contractaddresses=${options.contract.address}&apikey=${options.explorerApiKey}`,
  );
  const explorerData = await res.json();

  if (
    !explorerData ||
    explorerData.status !== RequestStatus.OK ||
    !explorerData.result[0]
  ) {
    // Could not retrieve constructor parameters, using empty parameters as fallback
    return "";
  }
  let constructorArgs = "";

  const txHash = explorerData.result[0].txHash as `0x${string}`;
  const rpcRequest = getRpcClient(options.contract);
  const tx = await eth_getTransactionByHash(rpcRequest, {
    hash: txHash,
  });
  const txDeployBytecode = tx.input;

  // first: attempt to get it from Publish
  try {
    const bytecode = await fetchDeployBytecodeFromPublishedContractMetadata(
      options.contract,
    );
    if (!bytecode) {
      throw new Error("Contract not published through thirdweb");
    }
    const bytecodeHex = bytecode.startsWith("0x") ? bytecode : `0x${bytecode}`;
    const create2FactoryAddress = await computeCreate2FactoryAddress(
      options.contract,
    );
    // if deterministic deploy through create2factory, remove salt length too
    const create2SaltLength = tx.to === create2FactoryAddress ? 64 : 0;
    constructorArgs = txDeployBytecode.substring(
      bytecodeHex.length + create2SaltLength,
    );
  } catch {
    // contracts not published through thirdweb
  }
  if (!constructorArgs) {
    // couldn't find bytecode from Publish, using regex to locate consturctor args thruogh solc metadata
    // https://docs.soliditylang.org/en/v0.8.17/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode
    // {6} = solc version
    // {4} = 0033, but noticed some contracts have values other than 00 33. (uniswap)
    const matches = [
      ...txDeployBytecode.matchAll(
        /(64736f6c6343[\w]{6}[\w]{4})(?!.*\1)(.*)$/g,
      ),
    ];

    // regex finds the LAST occurrence of solc metadata bytes, result always in same position
    // TODO: we currently don't handle error string embedded in the bytecode, need to strip ascii (upgradeableProxy) in patterns[2]
    // https://etherscan.io/address/0xee6a57ec80ea46401049e92587e52f5ec1c24785#code
    if (matches?.[0]?.[2]) {
      constructorArgs = matches[0][2];
    }
  }

  // third: attempt to guess it from the ABI inputs
  if (!constructorArgs) {
    // TODO: need to guess array / struct properly
    const constructorParamByteLength = constructorParamTypes.length * 64;
    constructorArgs = txDeployBytecode.substring(
      txDeployBytecode.length - constructorParamByteLength,
    );
  }

  try {
    // sanity check that the constructor params are valid
    // TODO: should we sanity check after each attempt?

    ox__AbiParameters.decode(constructorParamTypes, `0x${constructorArgs}`);
  } catch {
    throw new Error(
      "Verifying this contract requires it to be published. Run `npx thirdweb publish` to publish this contract, then try again.",
    );
  }

  return constructorArgs;
}
