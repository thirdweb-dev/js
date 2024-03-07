import {
  authenticateJWT,
  generateJWT,
  parseJWT,
  refreshJWT,
} from "./functions/jwt";
import {
  buildAndSignLoginPayload,
  buildLoginPayload,
  signLoginPayload,
  verifyLoginPayload,
} from "./functions/login";
import type { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { Json, User } from "./schema/common";
import {
  LoginOptionsWithOptionalDomain,
  LoginPayload,
  LoginPayloadData,
} from "./schema/login";
import { VerifyOptionsWithOptionalDomain } from "./schema/verify";
import { GenerateOptionsWithOptionalDomain } from "./schema/generate";
import {
  AuthenticateOptionsWithOptionalDomain,
  AuthenticationPayload,
} from "./schema/authenticate";
import { ThirdwebAuthOptions } from "./types";

export class ThirdwebAuth {
  private domain: string;
  private wallet: GenericAuthWallet;
  private options: ThirdwebAuthOptions;

  constructor(
    wallet: GenericAuthWallet,
    domain: string,
    options: ThirdwebAuthOptions = {},
  ) {
    this.wallet = wallet;
    this.domain = domain;
    this.options = options;
  }

  public updateWallet(wallet: GenericAuthWallet) {
    this.wallet = wallet;
  }

  public async payload(
    options?: LoginOptionsWithOptionalDomain,
  ): Promise<LoginPayloadData> {
    return buildLoginPayload({
      wallet: this.wallet,
      options: this.formatOptions(options),
    });
  }

  public async loginWithPayload(
    payload: LoginPayloadData,
  ): Promise<LoginPayload> {
    return signLoginPayload({ wallet: this.wallet, payload });
  }

  public async login(
    options?: LoginOptionsWithOptionalDomain,
  ): Promise<LoginPayload> {
    return buildAndSignLoginPayload({
      wallet: this.wallet,
      options: this.formatOptions(options),
    });
  }

  public async verify(
    payload: LoginPayload,
    options?: VerifyOptionsWithOptionalDomain,
  ): Promise<string> {
    return verifyLoginPayload({
      payload,
      options: this.formatOptions(options),
      clientOptions: this.options,
    });
  }

  public async generate(
    payload: LoginPayload,
    options?: GenerateOptionsWithOptionalDomain,
  ): Promise<string> {
    return generateJWT({
      wallet: this.wallet,
      payload,
      options: this.formatOptions(options),
      clientOptions: this.options,
    });
  }

  public async refresh(jwt: string, expirationTime?: Date): Promise<string> {
    return refreshJWT({
      wallet: this.wallet,
      jwt,
      options: { expirationTime },
    });
  }

  public async authenticate<TSession extends Json = Json>(
    jwt: string,
    options?: AuthenticateOptionsWithOptionalDomain,
  ): Promise<User<TSession>> {
    return authenticateJWT({
      wallet: this.wallet,
      jwt,
      options: this.formatOptions(options),
      clientOptions: this.options,
    });
  }

  public parseToken(jwt: string): AuthenticationPayload {
    return parseJWT(jwt);
  }

  private formatOptions<TOptions extends { domain?: string }>(
    options?: TOptions,
  ): Omit<TOptions, "domain"> & { domain: string } {
    return options
      ? { ...options, domain: options?.domain || this.domain }
      : ({ domain: this.domain } as Omit<TOptions, "domain"> & {
          domain: string;
        });
  }
}
