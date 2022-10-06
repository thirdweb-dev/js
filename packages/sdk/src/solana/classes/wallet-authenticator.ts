import {
  AuthenticationOptions,
  AuthenticationOptionsSchema,
  AuthenticationPayloadData,
  AuthenticationPayloadDataSchema,
  LoginOptions,
  LoginOptionsSchema,
  LoginPayload,
  LoginPayloadData,
  LoginPayloadDataSchema,
} from "../types/auth";
import { UserWallet } from "./user-wallet";
import { PublicKey } from "@solana/web3.js";
import { isBrowser } from "@thirdweb-dev/storage";

/**
 * Wallet Authenticator
 * @remarks The wallet authenticator enables server-side applications to securely identify the
 * connected wallet address of users on the client-side, and also enables users to authenticate
 * to any backend using just their wallet. It implements the JSON Web Token (JWT) authentication
 * standard.
 *
 * @example
 * ```javascript
 * // We specify the domain of the application to authenticate to
 * const domain = "example.com"
 *
 * // On the client side, we can generate a payload for the connected wallet to login
 * const loginPayload = await sdk.auth.login(domain);
 *
 * // Then on the server side, we can securely verify the connected client-side address
 * const address = sdk.auth.verify(domain, loginPayload);
 *
 * // And we can also generate an authentication token to send to the client
 * const token = sdk.auth.generate(domain, loginPayload);
 *
 * // Finally, the token can be send from the client to the server to make authenticated requests
 * // And the server can use the following function to authenticate a token and verify the associated address
 * const address = sdk.auth.authenticate(domain, token);
 * ```
 * @public
 */
export class WalletAuthenticator {
  private wallet: UserWallet;

  constructor(wallet: UserWallet) {
    this.wallet = wallet;
  }

  /**
   * Login With Connected Wallet
   * @remarks Client-side function that allows the connected wallet to login to a server-side application.
   * Generates a login payload that can be sent to the server-side for verification or authentication.
   *
   * @param domain - The domain of the server-side application to login to
   * @param options - Optional configuration options for the login request
   * @returns Login payload that can be used on the server-side to verify the login request or authenticate
   *
   * @example
   * ```javascript
   * // Add the domain of the application users will login to, this will be used throughout the login process
   * const domain = "example.com";
   * // Generate a signed login payload for the connected wallet to authenticate with
   * const loginPayload = await sdk.auth.login(domain);
   * ```
   */
  public async login(
    domain: string,
    options?: LoginOptions,
  ): Promise<LoginPayload> {
    const parsedOptions = LoginOptionsSchema.parse(options);

    const signerAddress = await this.wallet.getAddress();
    const expirationTime =
      parsedOptions?.expirationTime || new Date(Date.now() + 1000 * 60 * 5);
    const payloadData = LoginPayloadDataSchema.parse({
      domain,
      address: signerAddress,
      nonce: parsedOptions?.nonce,
      expiration_time: expirationTime,
    });

    const message = this.generateMessage(payloadData);
    const signature = await this.wallet.sign(message);

    return {
      payload: payloadData,
      signature,
    };
  }

  /**
   * Verify Logged In Address
   * @remarks Server-side function to securely verify the address of the logged in client-side wallet
   * by validating the provided client-side login request.
   *
   * @param domain - The domain of the server-side application to verify the login request for
   * @param payload - The login payload to verify
   * @returns The public key of the logged in wallet
   *
   * @example
   * ```javascript
   * const domain = "example.com";
   * const loginPayload = await sdk.auth.login(domain);
   *
   * // Verify the login request
   * const address = sdk.auth.verify(domain, loginPayload);
   * ```
   */
  public verify(domain: string, payload: LoginPayload): PublicKey {
    // Check that the intended domain matches the domain of the payload
    if (payload.payload.domain !== domain) {
      throw new Error(
        `Expected domain '${domain}' does not match domain on payload '${payload.payload.domain}'`,
      );
    }

    // Check that the payload hasn't expired
    const currentTime = new Date();
    if (currentTime > new Date(payload.payload.expiration_time)) {
      throw new Error(`Login request has expired`);
    }

    // Check that the signing address is the claimed wallet address
    const message = this.generateMessage(payload.payload);
    const isValid = this.wallet.verifySignature(
      message,
      payload.signature,
      payload.payload.public_key,
    );
    if (!isValid) {
      throw new Error(
        `Signer address '${payload.payload.public_key}' did not sign the provided message`,
      );
    }

    return new PublicKey(payload.payload.public_key);
  }

  /**
   * Generate Authentication Token
   * @remarks Server-side function that generates a JWT token from the provided login request that the
   * client-side wallet can use to authenticate to the server-side application.
   *
   * @param domain - The domain of the server-side application to authenticate to
   * @param payload - The login payload to authenticate with
   * @param options - Optional configuration options for the authentication request
   * @returns A authentication token that can be used by the client to make authenticated requests
   *
   * @example
   * ```javascript
   * const domain = "example.com";
   * const loginPayload = await sdk.auth.login(domain);
   *
   * // Generate a JWT token that can be sent to the client-side wallet and used for authentication
   * const token = await sdk.auth.generateAuthToken(domain, loginPayload);
   * ```
   */
  public async generateAuthToken(
    domain: string,
    payload: LoginPayload,
    options?: AuthenticationOptions,
  ): Promise<string> {
    if (isBrowser()) {
      throw new Error(
        "Authentication tokens should not be generated in the browser, as they must be signed by a server-side admin wallet.",
      );
    }

    const parsedOptions = AuthenticationOptionsSchema.parse(options);

    const userAddress = this.verify(domain, payload);
    const adminAddress = this.wallet.getAddress();
    const payloadData = AuthenticationPayloadDataSchema.parse({
      iss: adminAddress,
      sub: userAddress.toBase58(),
      aud: domain,
      nbf: parsedOptions?.invalidBefore || new Date(),
      exp:
        parsedOptions?.expirationTime ||
        new Date(Date.now() + 1000 * 60 * 60 * 5),
      iat: new Date(),
    });

    const message = JSON.stringify(payloadData);
    const signature = await this.wallet.sign(message);

    // Header used for JWT token specifying hash algorithm
    const header = {
      // Specify ECDSA with SHA-256 for hashing algorithm
      alg: "ES256",
      typ: "JWT",
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      "base64",
    );
    const encodedData = Buffer.from(JSON.stringify(payloadData))
      .toString("base64")
      .replace(/=/g, "");
    const encodedSignature = Buffer.from(signature).toString("base64");

    // Generate a JWT token with base64 encoded header, payload, and signature
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;

    return token;
  }

  /**
   * Authenticate With Token
   * @remarks Server-side function that authenticates the provided JWT token. This function verifies that
   * the provided authentication token is valid and returns the address of the authenticated wallet.
   *
   * @param domain - The domain of the server-side application doing authentication
   * @param token - The authentication token being used
   * @returns The address of the authenticated wallet
   *
   * @example
   * ```javascript
   * const domain = "example.com";
   * const loginPayload = await sdk.auth.login(domain);
   * const token = await sdk.auth.generateAuthToken(domain, loginPayload);
   *
   * // Authenticate the token and get the address of authenticating users wallet
   * const address = sdk.auth.authenticate(domain, token);
   * ```
   */
  public async authenticate(domain: string, token: string): Promise<string> {
    if (isBrowser()) {
      throw new Error(
        "Should not authenticate tokens in the browser, as they must be verified by the server-side admin wallet.",
      );
    }

    const encodedPayload = token.split(".")[1];
    const encodedSignature = token.split(".")[2];
    const payload: AuthenticationPayloadData = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString(),
    );
    const signature = Buffer.from(encodedSignature, "base64").toString();

    // Check that the token audience matches the domain
    if (payload.aud !== domain) {
      throw new Error(
        `Expected token to be for the domain '${domain}', but found token with domain '${payload.aud}'`,
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
    const connectedAddress = this.wallet.getAddress();
    if (connectedAddress.toLowerCase() !== payload.iss.toLowerCase()) {
      throw new Error(
        `Expected the connected wallet address '${connectedAddress}' to match the token issuer address '${payload.iss}'`,
      );
    }

    // Check that the connected wallet signed the token
    const isValid = this.wallet.verifySignature(
      JSON.stringify(payload),
      signature,
      connectedAddress,
    );
    if (!isValid) {
      throw new Error(
        `The connected wallet address '${connectedAddress}' did not sign the token`,
      );
    }

    return payload.sub;
  }

  /**
   * Generates a SIWS compliant message to sign based on the login payload
   */
  private generateMessage(payload: LoginPayloadData): string {
    let message = ``;

    // Add the domain and login address for transparency
    message += `${payload.domain} wants you to sign in with your account:\n${payload.public_key}\n\n`;

    // Prompt user to make sure domain is correct to prevent phishing attacks
    message += `Make sure that the requesting domain above matches the URL of the current website.\n\n`;

    message += `Nonce: ${payload.nonce}\n`;
    message += `Expiration Time: ${payload.expiration_time}\n`;

    return message;
  }
}
