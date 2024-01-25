import type { Json, ThirdwebAuth, User } from "../../../core";
import type { GetServerSidePropsContext, NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import type { ThirdwebAuthConfigShared } from '../../common/types'

export {
  ActiveBodySchema,
  LoginPayloadBodySchema,
  PayloadBodySchema
} from '../../common/types'

type RequestType =
  | GetServerSidePropsContext["req"]
  | NextRequest
  | NextApiRequest;

export type ThirdwebAuthConfig<
  TData extends Json = Json,
  TSession extends Json = Json,
> = ThirdwebAuthConfigShared & {
  callbacks?: {
    onLogin?:
      | ((address: string, req: NextApiRequest) => void | TSession)
      | ((address: string, req: NextApiRequest) => Promise<void | TSession>);
    onToken?:
      | ((token: string, req: NextApiRequest) => void)
      | ((token: string, req: NextApiRequest) => Promise<void>);
    onUser?:
      | (<TRequestType extends RequestType = RequestType>(
          user: User<TSession>,
          req: TRequestType,
        ) => void | TData)
      | (<TRequestType extends RequestType = RequestType>(
          user: User<TSession>,
          req: TRequestType,
        ) => Promise<void | TData>);
    onLogout?:
      | ((user: User, req: NextApiRequest) => void)
      | ((user: User, req: NextApiRequest) => Promise<void>);
  };
};

export type ThirdwebAuthContext<
  TData extends Json = Json,
  TSession extends Json = Json,
> = Omit<Omit<ThirdwebAuthConfig<TData, TSession>, "wallet">, "domain"> & {
  auth: ThirdwebAuth;
};
