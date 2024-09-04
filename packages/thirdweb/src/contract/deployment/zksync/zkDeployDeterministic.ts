import { type Abi, parseAbi } from "abitype";
import { hashBytecode } from "viem/zksync";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { readContract } from "../../../transaction/read-contract.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import { keccakId } from "../../../utils/any-evm/keccak-id.js";
import { computeDeploymentAddress } from "../../../utils/any-evm/zksync/computeDeploymentAddress.js";
import {
  KNOWN_CODES_STORAGE,
  singletonFactoryAbi,
} from "../../../utils/any-evm/zksync/constants.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { ensureBytecodePrefix } from "../../../utils/bytecode/prefix.js";
import { type Hex, uint8ArrayToHex } from "../../../utils/encoding/hex.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { getContract } from "../../contract.js";
import { zkDeployContract } from "./zkDeployContract.js";
import { zkDeployCreate2Factory } from "./zkDeployCreate2Factory.js";

/**
 * @internal
 */
export async function zkDeployContractDeterministic(
  options: ClientAndChainAndAccount & {
    abi: Abi;
    bytecode: Hex;
    params: unknown[];
    salt?: string;
  },
) {
  const constructorAbi = options.abi.find(
    (x) => "type" in x && x.type === "constructor",
  ) || { inputs: [] };
  const encodedArgs = encodeAbiParameters(
    constructorAbi.inputs,
    options.params || [],
  );
  const create2FactoryAddress = await zkDeployCreate2Factory({
    client: options.client,
    chain: options.chain,
    account: options.account,
  });
  const bytecode = ensureBytecodePrefix(options.bytecode);
  const bytecodeHash = uint8ArrayToHex(hashBytecode(bytecode));
  const predictedAddress = computeDeploymentAddress({
    bytecodeHash,
    encodedArgs,
    create2FactoryAddress,
    salt: options.salt,
  });
  const deployed = await isContractDeployed({
    address: predictedAddress,
    chain: options.chain,
    client: options.client,
  });
  if (!deployed) {
    // check if bytecodehash is known
    const knownCodesStorageContract = getContract({
      address: KNOWN_CODES_STORAGE,
      chain: options.chain,
      client: options.client,
    });
    const marker = await readContract({
      contract: knownCodesStorageContract,
      method: "function getMarker(bytes32 _hash) view returns (uint256 marker)",
      params: [bytecodeHash],
    });
    // if not known, publish the bytecodehash
    if (marker !== 1n) {
      await zkDeployContract({
        client: options.client,
        chain: options.chain,
        account: options.account,
        abi: options.abi,
        bytecode,
        params: options.params,
      });
    }

    console.log(
      `deploying contract via create2 factory at: ${predictedAddress}`,
    );

    // deploy with create2 factory
    const factory = getContract({
      address: create2FactoryAddress,
      chain: options.chain,
      client: options.client,
      abi: parseAbi(singletonFactoryAbi),
    });

    const salt = options?.salt ? keccakId(options.salt) : keccakId("thirdweb");

    await sendAndConfirmTransaction({
      account: options.account,
      transaction: prepareContractCall({
        contract: factory,
        method: "deploy",
        params: [salt, bytecodeHash, encodedArgs],
      }),
    });
  }

  return predictedAddress;
}
