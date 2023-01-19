import {
  LoginOptions,
  LoginPayload,
  GenerateOptions,
  LoginPayloadData,
  LoginPayloadDataSchema,
  AuthenticationPayloadDataSchema,
  AuthenticationPayloadData,
  LoginOptionsSchema,
  VerifyOptionsSchema,
  VerifyOptions,
  GenerateOptionsSchema,
  AuthenticateOptionsSchema,
  AuthenticateOptions,
  User,
  Json,
} from "./schema";
import { isBrowser } from "./utils";
import type { GenericSignerWallet } from "@thirdweb-dev/wallets";

export class ThirdwebAuth {
  private domain: string;
  private wallet: GenericSignerWallet;

  constructor(wallet: GenericSignerWallet, domain: string) {
    this.wallet = wallet;
    this.domain = domain;
  }

  public updateWallet(wallet: GenericSignerWallet) {
    this.wallet = wallet;
  }

  public async login(options?: LoginOptions): Promise<LoginPayload> {
    const parsedOptions = LoginOptionsSchema.parse(options);
    const domain = parsedOptions?.domain || this.domain;

    const signerAddress = await this.wallet.getAddress();
    const expirationTime =
      parsedOptions?.expirationTime || new Date(Date.now() + 1000 * 60 * 5);
    const payloadData = LoginPayloadDataSchema.parse({
      domain,
      address: signerAddress,
      nonce: parsedOptions?.nonce,
      expiration_time: expirationTime,
      chain_id: parsedOptions?.chainId,
    });

    const message = this.generateMessage(payloadData);
    const signature = await this.wallet.signMessage(message);

    return {
      payload: payloadData,
      signature,
    };
  }

  public async verify(
    payload: LoginPayload,
    options?: VerifyOptions,
  ): Promise<string> {
    const parsedOptions = VerifyOptionsSchema.parse(options);
    const domain = parsedOptions?.domain || this.domain;

    // Check that the intended domain matches the domain of the payload
    if (payload.payload.domain !== domain) {
      throw new Error(
        `Expected domain '${domain}' does not match domain on payload '${payload.payload.domain}'`,
      );
    }

    if (parsedOptions?.validateNonce !== undefined) {
      try {
        parsedOptions.validateNonce(payload.payload.nonce);
      } catch (err) {
        throw new Error(`Login request nonce is invalid`);
      }
    }

    // Check that the payload hasn't expired
    const currentTime = new Date();
    if (currentTime > new Date(payload.payload.expiration_time)) {
      throw new Error(`Login request has expired`);
    }

    // If chain ID is specified, check that it matches the chain ID of the signature
    if (
      parsedOptions?.chainId !== undefined &&
      parsedOptions.chainId !== payload.payload.chain_id
    ) {
      throw new Error(
        `Chain ID '${parsedOptions.chainId}' does not match payload chain ID '${payload.payload.chain_id}'`,
      );
    }

    // Check that the signing address is the claimed wallet address
    const message = this.generateMessage(payload.payload);
    const verified = await this.wallet.verifySignature(
      message,
      payload.signature,
      payload.payload.address,
    );
    if (!verified) {
      throw new Error(
        `Signer address does not match payload address '${payload.payload.address.toLowerCase()}'`,
      );
    }

    return payload.payload.address;
  }

  public async generate(
    payload: LoginPayload,
    options?: GenerateOptions,
  ): Promise<string> {
    if (isBrowser()) {
      throw new Error(
        "Authentication tokens should not be generated in the browser, as they must be signed by a server-side admin wallet.",
      );
    }

    const parsedOptions = GenerateOptionsSchema.parse(options);
    const domain = parsedOptions?.domain || this.domain;

    const userAddress = await this.verify(payload, {
      domain,
      chainId: parsedOptions?.chainId,
      validateNonce: parsedOptions?.validateNonce,
    });
    const adminAddress = await this.wallet.getAddress();
    const payloadData = AuthenticationPayloadDataSchema.parse({
      iss: adminAddress,
      sub: userAddress,
      aud: domain,
      nbf: parsedOptions?.invalidBefore || new Date(),
      exp:
        parsedOptions?.expirationTime ||
        new Date(Date.now() + 1000 * 60 * 60 * 5),
      iat: new Date(),
      ctx: parsedOptions?.context,
    });

    const message = JSON.stringify(payloadData);
    const signature = await this.wallet.signMessage(message);

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
  public async authenticate<TContext extends Json = Json>(
    token: string,
    options?: AuthenticateOptions,
  ): Promise<User<TContext>> {
    if (isBrowser()) {
      throw new Error(
        "Should not authenticate tokens in the browser, as they must be verified by the server-side admin wallet.",
      );
    }

    const parsedOptions = AuthenticateOptionsSchema.parse(options);
    const domain = parsedOptions?.domain || this.domain;

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
    const connectedAddress = await this.wallet.getAddress();
    if (connectedAddress.toLowerCase() !== payload.iss.toLowerCase()) {
      throw new Error(
        `Expected the connected wallet address '${connectedAddress}' to match the token issuer address '${payload.iss}'`,
      );
    }

    const verified = await this.wallet.verifySignature(
      JSON.stringify(payload),
      signature,
      connectedAddress,
    );
    if (!verified) {
      throw new Error(
        `The connected wallet address '${connectedAddress}' did not sign the token`,
      );
    }

    return {
      address: payload.sub,
      context: payload.ctx as TContext | undefined,
      token: payload,
    };
  }

  /**
   * Generates a EIP-4361 compliant message to sign based on the login payload
   */
  private generateMessage(payload: LoginPayloadData): string {
    let message = ``;

    // Add the domain and login address for transparency
    message += `${payload.domain} wants you to sign in with your account:\n${payload.address}\n\n`;

    // Prompt user to make sure domain is correct to prevent phishing attacks
    message += `Make sure that the requesting domain above matches the URL of the current website.\n\n`;

    // Add data fields in compliance with the EIP-4361 standard
    if (payload.chain_id) {
      message += `Chain ID: ${payload.chain_id}\n`;
    }

    message += `Nonce: ${payload.nonce}\n`;
    message += `Expiration Time: ${payload.expiration_time}\n`;

    return message;
  }
}
