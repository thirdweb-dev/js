import type { Address } from "../../address.js";
import type { Hex } from "../../encoding/hex.js";
import { keccakId } from "../keccak-id.js";
import { create2Address } from "./create2Address.js";

type ComputeDeploymentAddressOptions = {
  bytecodeHash: Hex;
  encodedArgs: Hex;
  create2FactoryAddress: Address;
  salt?: string;
};

export function computeDeploymentAddress(
  options: ComputeDeploymentAddressOptions,
) {
  const saltHash = options.salt ? keccakId(options.salt) : keccakId("thirdweb");

  return create2Address({
    sender: options.create2FactoryAddress,
    bytecodeHash: options.bytecodeHash,
    salt: saltHash,
    input: options.encodedArgs,
  });
}
