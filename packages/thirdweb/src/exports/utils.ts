// bytecode

// any-evm utils
export {
  computeCreate2FactoryAddress,
  deployCreate2Factory,
  getDeployedCreate2Factory,
} from "../contract/deployment/utils/create-2-factory.js";
export { computeDeploymentAddress } from "../utils/any-evm/compute-deployment-address.js";
export type { ExtendedMetadata } from "../utils/any-evm/deploy-metadata.js";
export { getInitBytecodeWithSalt } from "../utils/any-evm/get-init-bytecode-with-salt.js";
export { getSaltHash } from "../utils/any-evm/get-salt-hash.js";
export { isEIP155Enforced } from "../utils/any-evm/is-eip155-enforced.js";
export { keccakId } from "../utils/any-evm/keccak-id.js";
export { getKeylessTransaction } from "../utils/any-evm/keyless-transaction.js";
export { isZkSyncChain } from "../utils/any-evm/zksync/isZkSyncChain.js";
export { detectMethod } from "../utils/bytecode/detectExtension.js";
export { extractIPFSUri } from "../utils/bytecode/extractIPFS.js";
export { extractMinimalProxyImplementationAddress } from "../utils/bytecode/extractMinimalProxyImplementationAddress.js";
export { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";
export { ensureBytecodePrefix } from "../utils/bytecode/prefix.js";
export { resolveImplementation } from "../utils/bytecode/resolveImplementation.js";
//signatures
export {
  resolveSignature,
  resolveSignatures,
} from "../utils/signatures/resolve-signature.js";
export { type SignOptions, sign } from "../utils/signatures/sign.js";
export {
  type SignMessageOptions,
  signMessage,
} from "../utils/signatures/sign-message.js";
export {
  type SignTypedDataOptions,
  signTypedData,
} from "../utils/signatures/sign-typed-data.js";
export { signatureToHex } from "../utils/signatures/signature-to-hex.js";
// units
export { fromGwei, toEther, toTokens, toUnits, toWei } from "../utils/units.js";

// ------------------------------------------------
// encoding
// ------------------------------------------------

// from
export {
  type BytesToBigIntOpts,
  type BytesToBoolOpts,
  type BytesToNumberOpts,
  type BytesToStringOpts,
  bytesToBigInt,
  bytesToBool,
  bytesToNumber,
  bytesToString,
  type FromBytesParameters,
  type FromBytesReturnType,
  fromBytes,
} from "../utils/encoding/from-bytes.js";
export { concatHex } from "../utils/encoding/helpers/concat-hex.js";
// hex
export {
  type BoolToHexOpts,
  boolToHex,
  type FromHexParameters,
  type FromHexReturnType,
  // from
  fromHex,
  type HexToBigIntOpts,
  type HexToBoolOpts,
  type HexToNumberOpts,
  type HexToStringOpts,
  type HexToUint8ArrayOpts,
  hexToBigInt,
  hexToBool,
  hexToNumber,
  hexToString,
  hexToUint8Array,
  type IsHexOptions,
  // util
  isHex,
  type NumberToHexOpts,
  numberToHex,
  padHex,
  type StringToHexOpts,
  stringToHex,
  type ToHexParameters,
  // to
  toHex,
  type Uint8ArrayToHexOpts,
  uint8ArrayToHex,
} from "../utils/encoding/hex.js";
// bytes
// to
export {
  type BoolToBytesOpts,
  boolToBytes,
  type HexToBytesOpts,
  hexToBytes,
  numberToBytes,
  type StringToBytesOpts,
  stringToBytes,
  type ToBytesParameters,
  toBytes,
} from "../utils/encoding/to-bytes.js";

// ------------------------------------------------
// hashing
// ------------------------------------------------

export type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiFallback,
  AbiFunction,
  AbiReceive,
} from "abitype";
// ------------------------------------------------
// values
// ------------------------------------------------
export { maxUint256 } from "ox/Solidity";
/**
 * @utils
 */
export {
  decodeAbiParameters,
  encodePacked,
  isBytes,
  toEventSelector,
  toFunctionSelector,
} from "viem";
export { decodeError } from "../utils/abi/decodeError.js";
export { decodeFunctionData } from "../utils/abi/decodeFunctionData.js";
export { decodeFunctionResult } from "../utils/abi/decodeFunctionResult.js";
// ------------------------------------------------
// abi
// ------------------------------------------------
export { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
// ------------------------------------------------
// address
// ------------------------------------------------
export {
  type Address,
  type AddressInput,
  checksumAddress,
  getAddress,
  isAddress,
  shortenAddress,
  shortenHex,
} from "../utils/address.js";
// ------------------------------------------------
// bigint
// ------------------------------------------------
export { max, min } from "../utils/bigint.js";
export {
  clearTransactionDecorator,
  getTransactionDecorator,
  setTransactionDecorator,
} from "../utils/config.js";
export { parseAbiParams } from "../utils/contract/parse-abi-params.js";
// Useful helpers
export { setServiceKey, setThirdwebDomains } from "../utils/domains.js";
// ENS
export { isValidENSName } from "../utils/ens/isValidENSName.js";
// ------------------------------------------------
// thirdweb Drop contracts
// ------------------------------------------------
export {
  type GetClaimParamsOptions,
  getClaimParams,
} from "../utils/extensions/drops/get-claim-params.js";
export { formatNumber } from "../utils/formatNumber.js";
// Ethereum Signed Message hashing
export { hashMessage } from "../utils/hashing/hashMessage.js";
// keccak256
export { keccak256 } from "../utils/hashing/keccak256.js";
// sha256
export { sha256 } from "../utils/hashing/sha256.js";
// ------------------------------------------------
// json
// ------------------------------------------------
export { stringify } from "../utils/json.js";
// ------------------------------------------------
// jwt
// ------------------------------------------------
export { decodeJWT } from "../utils/jwt/decode-jwt.js";
export { encodeJWT, type JWTPayloadInput } from "../utils/jwt/encode-jwt.js";
export { type RefreshJWTParams, refreshJWT } from "../utils/jwt/refresh-jwt.js";
export type { JWTPayload } from "../utils/jwt/types.js";
export type { NFTInput, NFTMetadata } from "../utils/nft/parseNft.js";
export { resolvePromisedValue } from "../utils/promise/resolve-promised-value.js";
export { shortenLargeNumber } from "../utils/shortenLargeNumber.js";
