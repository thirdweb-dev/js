import {
  MessageTypes,
  SignTypedDataVersion,
  TypedDataV1,
  TypedMessage,
  typedSignatureHash,
  TypedDataUtils,
} from "@metamask/eth-sig-util";
import {
  bufferToHex,
  publicToAddress,
  fromRpcSig,
  ecrecover,
} from "ethereumjs-util";

/**
 * Recover the public key from the given signature and message hash.
 *
 * @param messageHash - The hash of the signed message.
 * @param signature - The signature.
 * @returns The public key of the signer.
 */
export function recoverPublicKey(messageHash: Buffer, signature: string) {
  const sigParams = fromRpcSig(signature);
  return ecrecover(messageHash, sigParams.v, sigParams.r, sigParams.s);
}

/**
 * Validate that the given value is a valid version string.
 *
 * @param version - The version value to validate.
 * @param allowedVersions - A list of allowed versions. If omitted, all versions are assumed to be
 * allowed.
 */
export function validateVersion(
  version: SignTypedDataVersion,
  allowedVersions?: SignTypedDataVersion[],
): void {
  if (!Object.keys(SignTypedDataVersion).includes(version)) {
    throw new Error(`Invalid version: '${version}'`);
  } else if (allowedVersions && !allowedVersions.includes(version)) {
    throw new Error(
      `SignTypedDataVersion not allowed: '${version}'. Allowed versions are: ${allowedVersions.join(
        ", ",
      )}`,
    );
  }
}

interface RecoveryOptions<
  V extends SignTypedDataVersion,
  T extends MessageTypes,
> {
  /**
   *  The typed data that was signed.
   */
  data: V extends "V1" ? TypedDataV1 : TypedMessage<T>;
  /**
   *  The '0x-prefixed hex encoded message signature.
   */
  signature: string;
  /**
   *  The signing version to use.
   */
  version: V;
}

/**
 * Recover the address of the account that created the given EIP-712
 * signature. The version provided must match the version used to
 * create the signature.
 *
 * @param options - The signature recovery options.
 * @returns The '0x'-prefixed hex address of the signer.
 */
export function recoverTypedSignature<
  V extends SignTypedDataVersion,
  T extends MessageTypes,
>({ data, signature, version }: RecoveryOptions<V, T>): string {
  validateVersion(version);

  if (data === null || data === undefined) {
    throw new Error("Missing data parameter");
  } else if (signature === null || signature === undefined) {
    throw new Error("Missing signature parameter");
  }

  let messageHash: Buffer;
  if (version === SignTypedDataVersion.V1) {
    messageHash = Buffer.from(typedSignatureHash(data as TypedDataV1));
  } else {
    messageHash = TypedDataUtils.eip712Hash(
      data as TypedMessage<T>,
      version as SignTypedDataVersion.V3 | SignTypedDataVersion.V4,
    );
  }

  const publicKey = recoverPublicKey(messageHash, signature);
  const sender = publicToAddress(publicKey);
  return bufferToHex(sender);
}
