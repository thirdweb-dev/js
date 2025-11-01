import { hexToBigInt } from "viem";
import type { ExactEvmPayloadAuthorization } from "x402/types";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract } from "../contract/contract.js";
import { nonces } from "../extensions/erc20/__generated__/IERC20Permit/read/nonces.js";
import { type Address, getAddress } from "../utils/address.js";
import { type Hex, toHex } from "../utils/encoding/hex.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { getSupportedSignatureType } from "./common.js";
import { encodePayment } from "./encode.js";
import {
  extractEvmChainId,
  networkToCaip2ChainId,
  type RequestedPaymentPayload,
  type RequestedPaymentRequirements,
  type UnsignedPaymentPayload,
} from "./schemas.js";
import type { ERC20TokenAmount } from "./types.js";

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
  nonce: Hex,
): UnsignedPaymentPayload {
  const validAfter = BigInt(
    Math.floor(Date.now() / 1000) - 86400, // 24h before in case weird block timestamp behavior
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
        nonce: nonce,
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
  client: ThirdwebClient,
  account: Account,
  paymentRequirements: RequestedPaymentRequirements,
  x402Version: number,
): Promise<RequestedPaymentPayload> {
  const from = getAddress(account.address);
  const caip2ChainId = networkToCaip2ChainId(paymentRequirements.network);
  const chainId = extractEvmChainId(caip2ChainId);

  // TODO (402): support solana
  if (chainId === null) {
    throw new Error(`Unsupported chain ID: ${paymentRequirements.network}`);
  }

  const supportedSignatureType = await getSupportedSignatureType({
    client,
    asset: paymentRequirements.asset,
    chainId: chainId,
    eip712Extras: paymentRequirements.extra as
      | ERC20TokenAmount["asset"]["eip712"]
      | undefined,
  });

  switch (supportedSignatureType) {
    case "Permit": {
      const nonce = await nonces({
        contract: getContract({
          address: paymentRequirements.asset,
          chain: getCachedChain(chainId),
          client: client,
        }),
        owner: from,
      });
      const unsignedPaymentHeader = preparePaymentHeader(
        from,
        x402Version,
        paymentRequirements,
        toHex(nonce, { size: 32 }), // permit nonce
      );
      const { signature } = await signERC2612Permit(
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
    case "TransferWithAuthorization": {
      // default to transfer with authorization
      const nonce = await createNonce();
      const unsignedPaymentHeader = preparePaymentHeader(
        from,
        x402Version,
        paymentRequirements,
        nonce, // random nonce
      );
      const { signature } = await signERC3009Authorization(
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
    default:
      throw new Error(
        `No supported payment authorization methods found on ${paymentRequirements.asset} on chain ${paymentRequirements.network}`,
      );
  }
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
  client: ThirdwebClient,
  account: Account,
  paymentRequirements: RequestedPaymentRequirements,
  x402Version: number,
): Promise<string> {
  const payment = await signPaymentHeader(
    client,
    account,
    paymentRequirements,
    x402Version,
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
async function signERC3009Authorization(
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
  const chainId = extractEvmChainId(networkToCaip2ChainId(network));
  if (chainId === null) {
    throw new Error(`Unsupported chain ID: ${network}`);
  }
  const name = extra?.name;
  const version = extra?.version;

  const signature = await account.signTypedData({
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
      value: BigInt(value),
      validAfter: BigInt(validAfter),
      validBefore: BigInt(validBefore),
      nonce: nonce as Hex,
    },
  });

  return {
    signature,
  };
}

async function signERC2612Permit(
  account: Account,
  { from, to, value, validBefore, nonce }: ExactEvmPayloadAuthorization,
  { asset, network, extra }: RequestedPaymentRequirements,
): Promise<{ signature: Hex }> {
  const chainId = extractEvmChainId(networkToCaip2ChainId(network));
  if (chainId === null) {
    throw new Error(`Unsupported chain ID: ${network}`);
  }
  const name = extra?.name;
  const version = extra?.version;

  if (!name || !version) {
    throw new Error(
      "name and version are required in PaymentRequirements extra to pay with permit-based assets",
    );
  }

  //Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline
  const signature = await account.signTypedData({
    types: {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name,
      version,
      chainId,
      verifyingContract: getAddress(asset),
    },
    primaryType: "Permit" as const,
    message: {
      owner: getAddress(from),
      spender: getAddress(to),
      value: BigInt(value),
      nonce: hexToBigInt(nonce as Hex),
      deadline: BigInt(validBefore),
    },
  });

  return {
    signature,
  };
}

/**
 * Generates a random 32-byte nonce for use in authorization signatures
 *
 * @returns A random 32-byte nonce as a hex string
 */
async function createNonce(): Promise<Hex> {
  const cryptoObj =
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
      ? globalThis.crypto
      : // Dynamic require is needed to support node.js
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("crypto").webcrypto;
  return toHex(cryptoObj.getRandomValues(new Uint8Array(32)));
}
