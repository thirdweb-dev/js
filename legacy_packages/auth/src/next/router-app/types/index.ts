import type { Json, ThirdwebAuth, User } from "../../../core";
import type { ThirdwebAuthConfigShared } from '../../common/types'

export {
  ActiveBodySchema,
  LoginPayloadBodySchema,
  PayloadBodySchema
} from '../../common/types'

export type ThirdwebAuthConfig<
  TData extends Json = Json,
  TSession extends Json = Json,
> = ThirdwebAuthConfigShared & {
  callbacks?: {
    onLogin?:
      | ((address: string) => void | TSession)
      | ((address: string) => Promise<void | TSession>);
    onToken?:
      | ((token: string) => void)
      | ((token: string) => Promise<void>);
    onUser?:
      | ((user: User<TSession>) => void | TData)
      | ((user: User<TSession>) => Promise<void | TData>);
    onLogout?:
      | ((user: User) => void)
      | ((user: User) => Promise<void>);
  };
};

export type ThirdwebAuthContext<
  TData extends Json = Json,
  TSession extends Json = Json,
> = Omit<Omit<ThirdwebAuthConfig<TData, TSession>, "wallet">, "domain"> & {
  auth: ThirdwebAuth;
};
