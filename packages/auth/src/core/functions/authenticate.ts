import { AuthenticateOptionsSchema } from "../schema/authenticate";
import { Json, User } from "../schema/common";
import { AuthenticateParams } from "../schema/functions";
import { isBrowser } from "../utils";
import { parseJWT } from "./jwt";

export async function authenticate<TSession extends Json = Json>({
  wallet,
  jwt,
  options,
}: AuthenticateParams): Promise<User<TSession>> {
  if (isBrowser()) {
    throw new Error(
      "Should not authenticate tokens in the browser, as they must be verified by the server-side admin wallet.",
    );
  }

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
  const connectedAddress = await wallet.getAddress();
  if (connectedAddress.toLowerCase() !== payload.iss.toLowerCase()) {
    throw new Error(
      `Expected the connected wallet address '${connectedAddress}' to match the token issuer address '${payload.iss}'`,
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
    connectedAddress,
    chainId,
  );
  if (!verified) {
    throw new Error(
      `The connected wallet address '${connectedAddress}' did not sign the token`,
    );
  }

  return {
    address: payload.sub,
    session: payload.ctx as TSession | undefined,
  };
}
