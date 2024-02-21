// bytecode
export { extractIPFSUri } from "../utils/bytecode/extractIPFS.js";
export { detectMethod } from "../utils/bytecode/detectExtension.js";
export { extractMinimalProxyImplementationAddress } from "../utils/bytecode/extractMnimalProxyImplementationAddress.js";
export { resolveImplementation } from "../utils/bytecode/resolveImplementation.js";
export { ensureBytecodePrefix } from "../utils/bytecode/prefix.js";
export { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";

// units
export { toEther, toTokens, toUnits, toWei } from "../utils/units.js";

// any-evm utils
export { getInitBytecodeWithSalt } from "../utils/any-evm/get-init-bytecode-with-salt.js";
export { getSaltHash } from "../utils/any-evm/get-salt-hash.js";
export { computeDeploymentAddress } from "../utils/any-evm/compute-deployment-address.js";
export { keccakId } from "../utils/any-evm/keccak-id.js";
export { isEIP155Enforced } from "../utils/any-evm/is-eip155-enforced.js";
export { getKeylessTransaction } from "../utils/any-evm/keyless-transaction.js";
export {
  getCreate2FactoryAddress,
  getCreate2FactoryDeploymentInfo,
} from "../utils/any-evm/create-2-factory.js";

//signatures
export {
  resolveSignature,
  resolveSignatures,
} from "../utils/signatures/resolve-signature.js";

// ------------------------------------------------
// encoding
// ------------------------------------------------

// hex
export {
  // from
  fromHex,
  type FromHexParameters,
  type FromHexReturnType,
  hexToBool,
  type HexToBoolOpts,
  hexToNumber,
  type HexToNumberOpts,
  hexToBigInt,
  type HexToBigIntOpts,
  hexToString,
  type HexToStringOpts,
  hexToUint8Array,
  type HexToUint8ArrayOpts,
  // to
  toHex,
  type ToHexParameters,
  numberToHex,
  type NumberToHexOpts,
  stringToHex,
  type StringToHexOpts,
  uint8ArrayToHex,
  type Uint8ArrayToHexOpts,
  boolToHex,
  type BoolToHexOpts,
  // util
  isHex,
  type IsHexOptions,
  padHex,
} from "../utils/encoding/hex.js";

// bytes
// to
export {
  toBytes,
  type ToBytesParameters,
  boolToBytes,
  type BoolToBytesOpts,
  hexToBytes,
  type HexToBytesOpts,
  numberToBytes,
  stringToBytes,
  type StringToBytesOpts,
} from "../utils/encoding/to-bytes.js";
// from
export {
  fromBytes,
  type FromBytesParameters,
  type FromBytesReturnType,
  bytesToBigInt,
  type BytesToBigIntOpts,
  bytesToNumber,
  type BytesToNumberOpts,
  bytesToString,
  type BytesToStringOpts,
  bytesToBool,
  type BytesToBoolOpts,
} from "../utils/encoding/from-bytes.js";

// ------------------------------------------------
// hashing
// ------------------------------------------------

// keccak256
export { keccak256 } from "../utils/hashing/keccak256.js";

// sha256
export { sha256 } from "../utils/hashing/sha256.js";
