import { deccodeJWT } from "../utils/jwt/decode-jwt.js";
import { verifyEOASignature } from "./verifySignature.js";

export type VerifyJWTParams = {
  domain: string;
  issuerAddress: string;
  jwt: string;
};

/**
 * Authenticates a JSON Web Token (JWT) based on the provided options.
 * @param options - The options for JWT authentication.
 * @returns A boolean indicating whether the JWT is valid or not.
 * @throws An error if the JWT is invalid or any validation fails.
 * @example
 * ```ts
 * import { verifyJWT } from 'thirdweb/auth';
 *
 * const isValid = await verifyJWT({
 *  jwt,
 *  domain: 'example.org',
 *  issuerAddress: '0x1234567890123456789012345678901234567890',
 * });
 * ```
 */
export async function verifyJWT(options: VerifyJWTParams) {
  const { payload, signature } = deccodeJWT(options.jwt);

  // // check that the payload unique ID is valid if the validateTokenId function is provided
  // if (options.authOptions.validateTokenId) {
  //   try {
  //     const validateResult = await options.authOptions.validateTokenId(
  //       payload.jti,
  //     );
  //     if (!validateResult) {
  //       throw new Error(`Token ID is invalid`);
  //     }
  //   } catch (err) {
  //     throw new Error(`Token ID is invalid`);
  //   }
  // }

  // check that the token audience matches the domain
  if (payload.aud !== options.domain) {
    throw new Error(
      `Expected token to be for the domain '${options.domain}', but found token with domain '${payload.aud}'`,
    );
  }

  const currentTime = Math.floor(new Date().getTime() / 1000);

  // Check that the token is past the invalid before time

  if (currentTime < payload.nbf) {
    throw new Error(
      `This token is invalid before epoch time '${payload.nbf}', current epoch time is '${currentTime}'`,
    );
  }

  // Check that the token hasn't expired
  if (currentTime > payload.exp) {
    throw new Error(
      `This token expired at epoch time '${payload.exp}', current epoch time is '${currentTime}'`,
    );
  }

  // check that the token issuer matches the provided issuer address

  if (payload.iss.toLowerCase() !== options.issuerAddress.toLowerCase()) {
    throw new Error(
      `The expected issuer address '${options.issuerAddress}' did not match the token issuer address '${payload.iss}'`,
    );
  }

  // verify the signature

  return verifyEOASignature({
    address: options.issuerAddress,
    message: JSON.stringify(payload),
    singature: signature,
  });
}
