import { deccodeJWT } from "../../utils/jwt/decode-jwt.js";
import type { JWTPayload } from "../../utils/jwt/types.js";
import { verifyEOASignature } from "../verifySignature.js";
import type { AuthOptions } from "./types.js";

export type VerifyJWTParams = {
  jwt: string;
};

export type VerifyJWTResult =
  | {
      valid: true;
      parsedJWT: JWTPayload;
    }
  | {
      valid: false;
      error: string;
    };

/**
 * Verifies a JSON Web Token (JWT) based on the provided options.
 * @param options - The authentication options.
 * @returns A function that verifies the JWT based on the provided parameters.
 * @throws An error if no admin account is provided.
 * @internal
 */
export function verifyJWT(options: AuthOptions) {
  return async (params: VerifyJWTParams): Promise<VerifyJWTResult> => {
    const { payload, signature } = deccodeJWT(params.jwt);

    if (!options.adminAccount) {
      throw new Error("No admin account provided. Cannot verify JWT.");
    }

    if (options.jwt?.jwtId) {
      const valid = await options.jwt.jwtId.validate(payload.jti);
      if (!valid) {
        return {
          valid: false,
          error: "Invalid JWT ID",
        };
      }
    }

    // check that the token audience matches the domain
    if (payload.aud !== options.domain) {
      return {
        valid: false,
        error: `Expected token to be for the domain '${options.domain}', but found token with domain '${payload.aud}'`,
      };
    }

    // Check that the token is past the invalid before time
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (currentTime < payload.nbf) {
      return {
        valid: false,
        error: `This token is invalid before epoch time '${payload.nbf}', current epoch time is '${currentTime}'`,
      };
    }

    // Check that the token hasn't expired
    if (currentTime > payload.exp) {
      return {
        valid: false,
        error: `This token expired at epoch time '${payload.exp}', current epoch time is '${currentTime}'`,
      };
    }

    const issuerAddress = options.adminAccount.address;
    if (issuerAddress.toLowerCase() !== payload.iss.toLowerCase()) {
      return {
        valid: false,
        error: `The expected issuer address '${issuerAddress}' did not match the token issuer address '${payload.iss}'`,
      };
    }

    const verified = await verifyEOASignature({
      message: JSON.stringify(payload),
      signature,
      address: issuerAddress,
    });

    if (!verified) {
      return {
        valid: false,
        error: `The expected issuer address '${issuerAddress}' did not sign this token.`,
      };
    }

    return {
      valid: true,
      parsedJWT: payload,
    };
  };
}
