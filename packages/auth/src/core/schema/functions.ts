import { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { LoginPayload } from "./login";
import { VerifyOptions } from "./verify";
import {
  AuthenticateOptions,
  AuthenticationPayloadDataInput,
} from "./authenticate";
import { RefreshOptions } from "./refresh";

export type VerifyParams = {
  wallet: GenericAuthWallet;
  payload: LoginPayload;
  options: VerifyOptions;
};

export type AuthenticateParams = {
  wallet: GenericAuthWallet;
  jwt: string;
  options: AuthenticateOptions;
};

export type CreateJwtParams = {
  wallet: GenericAuthWallet;
  payload: AuthenticationPayloadDataInput;
};

export type RefreshJwtParams = {
  wallet: GenericAuthWallet;
  jwt: string;
  options?: RefreshOptions;
};
