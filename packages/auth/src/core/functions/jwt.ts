import {
  AuthenticateOptionsSchema,
  AuthenticationPayload,
  AuthenticationPayloadData,
  AuthenticationPayloadDataSchema,
} from "../schema/authenticate";
import { Json, User } from "../schema/common";
import {
  BuildJwtParams,
  RefreshJwtParams,
  GenerateJwtParams,
  AuthenticateJwtParams,
} from "../schema/functions";
import { GenerateOptionsSchema } from "../schema/generate";
import { RefreshOptionsSchema } from "../schema/refresh";
import { verifyLoginPayload } from "./login";

function isBrowser() {
  return typeof window !== "undefined";
}

function base64encode(data: string): string {
  if (isBrowser()) {
    return window.btoa(data);
  }

  return Buffer.from(data).toString("base64").replace(/=/g, "");
}

function base64decode(data: string): string {
  if (isBrowser()) {
    return window.atob(data);
  }

  return Buffer.from(data, "base64").toString();
}

/**
 * Build JWT token based on the authentication payload
 */
export async function buildJWT({
  wallet,
  payload,
}: BuildJwtParams): Promise<string> {
  const payloadData = AuthenticationPayloadDataSchema.parse(payload);

  const message = JSON.stringify(payloadData);
  const signature = await wallet.signMessage(message);

  // Header used for JWT token specifying hash algorithm
  const header = {
    // Specify ECDSA with SHA-256 for hashing algorithm
    alg: "ES256",
    typ: "JWT",
  };

  const encodedHeader = base64encode(JSON.stringify(header));
  const encodedData = base64encode(JSON.stringify(payloadData));
  const encodedSignature = base64encode(signature);

  // Generate a JWT with base64 encoded header, payload, and signature
  const jwt = `${encodedHeader}.${encodedData}.${encodedSignature}`;

  return jwt;
}

/**
 * Generate a new JWT using a login payload
 */
export async function generateJWT({
  wallet,
  payload,
  options,
}: GenerateJwtParams): Promise<string> {
  const parsedOptions = GenerateOptionsSchema.parse(options);
  const userAddress = await verifyLoginPayload({
    wallet,
    payload,
    options: {
      domain: parsedOptions.domain,
      ...parsedOptions.verifyOptions,
    },
  });

  let session: Json | undefined = undefined;
  if (typeof parsedOptions?.session === "function") {
    const sessionTrigger = (await parsedOptions.session(userAddress)) as Json;
    if (sessionTrigger) {
      session = sessionTrigger;
    }
  } else {
    session = parsedOptions?.session;
  }

  const adminAddress = await wallet.getAddress();
  return buildJWT({
    wallet,
    payload: {
      iss: adminAddress,
      sub: userAddress,
      aud: parsedOptions.domain,
      nbf: parsedOptions?.invalidBefore || new Date(),
      exp: parsedOptions.expirationTime,
      iat: new Date(),
      jti: parsedOptions?.tokenId,
      ctx: session,
    },
  });
}

/**
 * Parse data from an encoded auth JWT
 */
export function parseJWT(jwt: string): AuthenticationPayload {
  const encodedPayload = jwt.split(".")[1];
  const encodedSignature = jwt.split(".")[2];
  const payload: AuthenticationPayloadData = JSON.parse(
    base64decode(encodedPayload),
  );
  const signature = base64decode(encodedSignature);

  return {
    payload,
    signature,
  };
}

/**
 * Refresh an existing JWT
 */
export async function refreshJWT({
  wallet,
  jwt,
  options,
}: RefreshJwtParams): Promise<string> {
  const { payload } = parseJWT(jwt);
  const parsedOptions = RefreshOptionsSchema.parse(options);
  return buildJWT({
    wallet,
    payload: {
      iss: payload.iss,
      sub: payload.sub,
      aud: payload.aud,
      nbf: new Date(),
      exp: parsedOptions.expirationTime,
      iat: new Date(),
      ctx: payload.ctx,
    },
  });
}

/**
 * Validate a JWT and extract the user's info
 */
export async function authenticateJWT<TSession extends Json = Json>({
  wallet,
  jwt,
  options,
}: AuthenticateJwtParams): Promise<User<TSession>> {
  const parsedOptions = AuthenticateOptionsSchema.parse(options);
  const { payload, signature } = parseJWT(jwt);

  // Check that the payload unique ID is valid
  if (parsedOptions?.validateTokenId !== undefined) {
    try {
      await parsedOptions.validateTokenId(payload.jti);
    } catch (err) {
      throw new Error(`Token ID is invalid`);
    }
  }

  // Check that the token audience matches the domain
  if (payload.aud !== parsedOptions.domain) {
    throw new Error(
      `Expected token to be for the domain '${parsedOptions.domain}', but found token with domain '${payload.aud}'`,
    );
  }

  // Check that the token is past the invalid before time
  const currentTime = Math.floor(new Date().getTime() / 1000);
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

  // Check that the connected wallet matches the token issuer
  const issuerAddress = parsedOptions.issuerAddress
    ? parsedOptions.issuerAddress
    : await wallet.getAddress();
  if (issuerAddress.toLowerCase() !== payload.iss.toLowerCase()) {
    throw new Error(
      `The expected issuer address '${issuerAddress}' did not match the token issuer address '${payload.iss}'`,
    );
  }

  let chainId: number | undefined = undefined;
  if (wallet.getChainId) {
    try {
      chainId = await wallet.getChainId();
    } catch {
      // ignore error
    }
  }

  const verified = await wallet.verifySignature(
    JSON.stringify(payload),
    signature,
    issuerAddress,
    chainId,
  );
  if (!verified) {
    throw new Error(
      `The expected signer address '${issuerAddress}' did not sign the token`,
    );
  }

  return {
    address: payload.sub,
    session: payload.ctx as TSession | undefined,
  };
}
