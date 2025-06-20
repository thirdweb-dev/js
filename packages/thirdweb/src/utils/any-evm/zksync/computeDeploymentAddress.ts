import type { Address } from "../../address.js";
import { type Hex, isHex } from "../../encoding/hex.js";
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
  const saltHash = options.salt
    ? isHex(options.salt) && options.salt.length === 66
      ? options.salt
      : keccakId(options.salt)
    : keccakId("thirdweb");

  return create2Address({
    bytecodeHash: options.bytecodeHash,
    input: options.encodedArgs,
    salt: saltHash,
    sender: options.create2FactoryAddress,
  });
}
