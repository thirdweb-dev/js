import { type X402Version, x402Version } from "./types.js";

const PAYMENT_HEADER_V1 = "X-PAYMENT";
const PAYMENT_HEADER_V2 = "PAYMENT-SIGNATURE";
const PAYMENT_RESPONSE_HEADER_V1 = "X-PAYMENT-RESPONSE";
const PAYMENT_RESPONSE_HEADER_V2 = "PAYMENT-RESPONSE";

function resolveVersion(version?: number | X402Version): X402Version {
  return version === 1 ? 1 : 2;
}

export function getPaymentRequestHeader(
  version?: number | X402Version,
): string {
  const resolvedVersion = resolveVersion(version ?? x402Version);
  return resolvedVersion === 1 ? PAYMENT_HEADER_V1 : PAYMENT_HEADER_V2;
}

export function getPaymentResponseHeader(
  version?: number | X402Version,
): string {
  const resolvedVersion = resolveVersion(version ?? x402Version);
  return resolvedVersion === 1
    ? PAYMENT_RESPONSE_HEADER_V1
    : PAYMENT_RESPONSE_HEADER_V2;
}
