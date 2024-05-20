// bytecode
export { detectMethod } from "../utils/bytecode/detectExtension.js";
export { extractIPFSUri } from "../utils/bytecode/extractIPFS.js";
export { extractMinimalProxyImplementationAddress } from "../utils/bytecode/extractMnimalProxyImplementationAddress.js";
export { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";
export { ensureBytecodePrefix } from "../utils/bytecode/prefix.js";
export { resolveImplementation } from "../utils/bytecode/resolveImplementation.js";

// units
export { toEther, toTokens, toUnits, toWei, fromGwei } from "../utils/units.js";

// any-evm utils
export {
  deployCreate2Factory,
  getDeployedCreate2Factory,
  computeCreate2FactoryAddress,
} from "../contract/deployment/utils/create-2-factory.js";
export { computeDeploymentAddress } from "../utils/any-evm/compute-deployment-address.js";
export { getInitBytecodeWithSalt } from "../utils/any-evm/get-init-bytecode-with-salt.js";
export { getSaltHash } from "../utils/any-evm/get-salt-hash.js";
export { isEIP155Enforced } from "../utils/any-evm/is-eip155-enforced.js";
export { keccakId } from "../utils/any-evm/keccak-id.js";
export { getKeylessTransaction } from "../utils/any-evm/keyless-transaction.js";

//signatures
export {
  resolveSignature,
  resolveSignatures,
} from "../utils/signatures/resolve-signature.js";
export { type SignOptions, sign } from "../utils/signatures/sign.js";
export { signatureToHex } from "../utils/signatures/signature-to-hex.js";
export {
  type SignMessageOptions,
  signMessage,
} from "../utils/signatures/sign-message.js";
export {
  type SignTypedDataOptions,
  signTypedData,
} from "../utils/signatures/sign-typed-data.js";

// ------------------------------------------------
// encoding
// ------------------------------------------------

// hex
export {
  boolToHex,
  // from
  fromHex,
  hexToBigInt,
  hexToBool,
  hexToNumber,
  hexToString,
  hexToUint8Array,
  // util
  isHex,
  numberToHex,
  padHex,
  stringToHex,
  // to
  toHex,
  uint8ArrayToHex,
  type BoolToHexOpts,
  type FromHexParameters,
  type FromHexReturnType,
  type HexToBigIntOpts,
  type HexToBoolOpts,
  type HexToNumberOpts,
  type HexToStringOpts,
  type HexToUint8ArrayOpts,
  type IsHexOptions,
  type NumberToHexOpts,
  type StringToHexOpts,
  type ToHexParameters,
  type Uint8ArrayToHexOpts,
} from "../utils/encoding/hex.js";
export { concatHex } from "../utils/encoding/helpers/concat-hex.js";

// bytes
// to
export {
  boolToBytes,
  hexToBytes,
  numberToBytes,
  stringToBytes,
  toBytes,
  type BoolToBytesOpts,
  type HexToBytesOpts,
  type StringToBytesOpts,
  type ToBytesParameters,
} from "../utils/encoding/to-bytes.js";
// from
export {
  bytesToBigInt,
  bytesToBool,
  bytesToNumber,
  bytesToString,
  fromBytes,
  type BytesToBigIntOpts,
  type BytesToBoolOpts,
  type BytesToNumberOpts,
  type BytesToStringOpts,
  type FromBytesParameters,
  type FromBytesReturnType,
} from "../utils/encoding/from-bytes.js";

// ------------------------------------------------
// hashing
// ------------------------------------------------

// keccak256
export { keccak256 } from "../utils/hashing/keccak256.js";

// sha256
export { sha256 } from "../utils/hashing/sha256.js";

// Ethereum Signed Message hashing
export { hashMessage } from "../utils/hashing/hashMessage.js";

// ------------------------------------------------
// address
// ------------------------------------------------
export {
  checksumAddress,
  getAddress,
  isAddress,
  shortenAddress,
  type Address,
  type AddressInput,
} from "../utils/address.js";

// ------------------------------------------------
// abi
// ------------------------------------------------
export { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
export { encodePacked } from "viem";

// Useful helpers
export { setThirdwebDomains } from "../utils/domains.js";
export { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";

// ------------------------------------------------
// json
// ------------------------------------------------
export { stringify } from "../utils/json.js";

// ------------------------------------------------
// values
// ------------------------------------------------
export { maxUint256 } from "viem";
