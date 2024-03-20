import { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { LoginOptions, LoginPayload, LoginPayloadData } from "./login";
import { VerifyOptions } from "./verify";
import {
  AuthenticateOptions,
  AuthenticationPayloadDataInput,
} from "./authenticate";
import { RefreshOptions } from "./refresh";
import { GenerateOptions } from "./generate";
import { ThirdwebAuthOptions } from "../types";

export type BuildLoginPayloadParams = {
  wallet: GenericAuthWallet;
  options: LoginOptions;
};

export type SignLoginPayloadParams = {
  wallet: GenericAuthWallet;
  payload: LoginPayloadData;
};

export type VerifyLoginPayloadParams = {
  payload: LoginPayload;
  options: VerifyOptions;
  clientOptions: ThirdwebAuthOptions;
};

export type BuildJwtParams = {
  wallet: GenericAuthWallet;
  payload: AuthenticationPayloadDataInput;
};

export type GenerateJwtParams = {
  wallet: GenericAuthWallet;
  payload: LoginPayload;
  options: GenerateOptions;
  clientOptions: ThirdwebAuthOptions;
};

export type RefreshJwtParams = {
  wallet: GenericAuthWallet;
  jwt: string;
  options?: RefreshOptions;
};

export type AuthenticateJwtParams = {
  wallet: GenericAuthWallet;
  jwt: string;
  options: AuthenticateOptions;
  clientOptions: ThirdwebAuthOptions;
};
