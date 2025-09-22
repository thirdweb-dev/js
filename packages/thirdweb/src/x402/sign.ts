import type { ExactEvmPayloadAuthorization } from "x402/types";
import { type Address, getAddress } from "../utils/address.js";
import { type Hex, toHex } from "../utils/encoding/hex.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { encodePayment } from "./encode.js";
import {
  networkToChainId,
  type RequestedPaymentPayload,
  type RequestedPaymentRequirements,
  type UnsignedPaymentPayload,
} from "./schemas.js";

/**
 * Prepares an unsigned payment header with the given sender address and payment requirements.
 *
 * @param from - The sender's address from which the payment will be made
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns An unsigned payment payload containing authorization details
 */
function preparePaymentHeader(
  from: Address,
  x402Version: number,
  paymentRequirements: RequestedPaymentRequirements,
): UnsignedPaymentPayload {
  const nonce = createNonce();

  const validAfter = BigInt(
    Math.floor(Date.now() / 1000) - 600, // 10 minutes before
  ).toString();
  const validBefore = BigInt(
    Math.floor(Date.now() / 1000 + paymentRequirements.maxTimeoutSeconds),
  ).toString();

  return {
    x402Version,
    scheme: paymentRequirements.scheme,
    network: paymentRequirements.network,
    payload: {
      signature: undefined,
      authorization: {
        from,
        to: paymentRequirements.payTo as Address,
        value: paymentRequirements.maxAmountRequired,
        validAfter: validAfter.toString(),
        validBefore: validBefore.toString(),
        nonce,
      },
    },
  };
}

/**
 * Signs a payment header using the provided client and payment requirements.
 *
 * @param client - The signer wallet instance used to sign the payment header
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @param unsignedPaymentHeader - The unsigned payment payload to be signed
 * @returns A promise that resolves to the signed payment payload
 */
async function signPaymentHeader(
  account: Account,
  paymentRequirements: RequestedPaymentRequirements,
  unsignedPaymentHeader: UnsignedPaymentPayload,
): Promise<RequestedPaymentPayload> {
  const { signature } = await signAuthorization(
    account,
    unsignedPaymentHeader.payload.authorization,
    paymentRequirements,
  );

  return {
    ...unsignedPaymentHeader,
    payload: {
      ...unsignedPaymentHeader.payload,
      signature,
    },
  };
}

/**
 * Creates a complete payment payload by preparing and signing a payment header.
 *
 * @param client - The signer wallet instance used to create and sign the payment
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the complete signed payment payload
 */
async function createPayment(
  account: Account,
  x402Version: number,
  paymentRequirements: RequestedPaymentRequirements,
): Promise<RequestedPaymentPayload> {
  const from = getAddress(account.address);
  const unsignedPaymentHeader = preparePaymentHeader(
    from,
    x402Version,
    paymentRequirements,
  );
  return signPaymentHeader(account, paymentRequirements, unsignedPaymentHeader);
}

/**
 * Creates and encodes a payment header for the given client and payment requirements.
 *
 * @param client - The signer wallet instance used to create the payment header
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the encoded payment header string
 */
export async function createPaymentHeader(
  account: Account,
  x402Version: number,
  paymentRequirements: RequestedPaymentRequirements,
): Promise<string> {
  const payment = await createPayment(
    account,
    x402Version,
    paymentRequirements,
  );
  return encodePayment(payment);
}

/**
 * Signs an EIP-3009 authorization for USDC transfer
 *
 * @param walletClient - The wallet client that will sign the authorization
 * @param params - The authorization parameters containing transfer details
 * @param params.from - The address tokens will be transferred from
 * @param params.to - The address tokens will be transferred to
 * @param params.value - The amount of USDC tokens to transfer (in base units)
 * @param params.validAfter - Unix timestamp after which the authorization becomes valid
 * @param params.validBefore - Unix timestamp before which the authorization is valid
 * @param params.nonce - Random 32-byte nonce to prevent replay attacks
 * @param paymentRequirements - The payment requirements containing asset and network information
 * @param paymentRequirements.asset - The address of the USDC contract
 * @param paymentRequirements.network - The network where the USDC contract exists
 * @param paymentRequirements.extra - The extra information containing the name and version of the ERC20 contract
 * @returns The signature for the authorization
 */
async function signAuthorization(
  account: Account,
  {
    from,
    to,
    value,
    validAfter,
    validBefore,
    nonce,
  }: ExactEvmPayloadAuthorization,
  { asset, network, extra }: RequestedPaymentRequirements,
): Promise<{ signature: Hex }> {
  const chainId = networkToChainId(network);
  const name = extra?.name;
  const version = extra?.version;

  // TODO (402): detect permit vs transfer on asset contract
  const data = {
    types: {
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    domain: {
      name,
      version,
      chainId,
      verifyingContract: getAddress(asset),
    },
    primaryType: "TransferWithAuthorization" as const,
    message: {
      from: getAddress(from),
      to: getAddress(to),
      value,
      validAfter,
      validBefore,
      nonce: nonce,
    },
  };

  const signature = await account.signTypedData(data);
  return {
    signature,
  };
}

/**
 * Generates a random 32-byte nonce for use in authorization signatures
 *
 * @returns A random 32-byte nonce as a hex string
 */
function createNonce(): Hex {
  const cryptoObj =
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
      ? globalThis.crypto
      : // Dynamic require is needed to support node.js
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("crypto").webcrypto;
  return toHex(cryptoObj.getRandomValues(new Uint8Array(32)));
}
