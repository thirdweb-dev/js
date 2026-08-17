import { stringify } from "../../utils/json.js";
import { decodeJWT } from "../../utils/jwt/decode-jwt.js";
import type { JWTPayload } from "../../utils/jwt/types.js";
import { verifyEOASignature } from "../verify-signature.js";
import type { AuthOptions } from "./types.js";

/**
 * @auth
 */
type VerifyJWTParams = {
  jwt: string;
};

/**
 * @auth
 */
type VerifyJWTResult =
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
    const { payload, signature } = decodeJWT(params.jwt);

    if (!options.adminAccount) {
      throw new Error("No admin account provided. Cannot verify JWT.");
    }

    if (options.jwt?.jwtId) {
      const valid = await options.jwt.jwtId.validate(payload.jti);
      if (!valid) {
        return {
          error: "Invalid JWT ID",
          valid: false,
        };
      }
    }

    // check that the token audience matches the domain
    if (payload.aud !== options.domain) {
      return {
        error: `Expected token to be for the domain '${options.domain}', but found token with domain '${payload.aud}'`,
        valid: false,
      };
    }

    // Invalid Date / missing NumericDate comparisons are always false in JS,
    // so a non-finite nbf or exp previously skipped the time bounds.
    const nbf = finiteEpoch(payload.nbf);
    if (nbf === undefined) {
      return {
        error: "Payload has invalid Not Before time",
        valid: false,
      };
    }
    const exp = finiteEpoch(payload.exp);
    if (exp === undefined) {
      return {
        error: "Payload has invalid Expiration Time",
        valid: false,
      };
    }

    // Check that the token is past the invalid before time
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < nbf) {
      return {
        error: `This token is invalid before epoch time '${nbf}', current epoch time is '${currentTime}'`,
        valid: false,
      };
    }

    // Check that the token hasn't expired
    if (currentTime > exp) {
      return {
        error: `This token expired at epoch time '${exp}', current epoch time is '${currentTime}'`,
        valid: false,
      };
    }

    const issuerAddress = options.adminAccount.address;
    if (issuerAddress.toLowerCase() !== payload.iss.toLowerCase()) {
      return {
        error: `The expected issuer address '${issuerAddress}' did not match the token issuer address '${payload.iss}'`,
        valid: false,
      };
    }

    const verified = await verifyEOASignature({
      address: issuerAddress,
      message: stringify(payload),
      signature,
    });

    if (!verified) {
      return {
        error: `The expected issuer address '${issuerAddress}' did not sign this token.`,
        valid: false,
      };
    }

    return {
      parsedJWT: payload,
      valid: true,
    };
  };
}

function finiteEpoch(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return value;
}
