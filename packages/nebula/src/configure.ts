import { type Config, createClient, createConfig } from "@hey-api/client-fetch";
import type { ThirdwebClient } from "thirdweb";
import { client } from "./client/client.gen.js";

export type NebulaClientOptions = {
  readonly clientId?: string;
  readonly secretKey?: string;
  readonly authToken?: string;
};

export function getNebulaClient(baseUrl: string, options: NebulaClientOptions) {
  return createClient(
    createConfig({
      baseUrl,
      headers: {
        ...(options.clientId && { "x-client-id": options.clientId }),
        ...(options.secretKey && { "x-secret-key": options.secretKey }),
        ...(options.authToken && {
          authorization: `Bearer ${options.authToken}`,
        }),
      },
    }),
  );
}

export function configure(
  options: NebulaClientOptions & { override?: Config },
) {
  client.setConfig({
    bodySerializer: stringify,
    headers: {
      ...(options.clientId && { "x-client-id": options.clientId }),
      ...(options.secretKey && { "x-secret-key": options.secretKey }),
      ...(options.authToken && {
        authorization: `Bearer ${options.authToken}`,
      }),
    },
    ...(options.override ?? {}),
  });
}

export function configureWithClient(
  twClient: ThirdwebClient,
  options?: NebulaClientOptions,
  override?: Config,
) {
  client.setConfig({
    bodySerializer: stringify,
    headers: {
      ...(twClient.clientId && { "x-client-id": twClient.clientId }),
      ...(twClient.secretKey && { "x-secret-key": twClient.secretKey }),
      ...(options?.authToken && {
        authorization: `Bearer ${options.authToken}`,
      }),
    },
    ...(override ?? {}),
  });
}

function stringify(
  // biome-ignore lint/suspicious/noExplicitAny: JSON.stringify signature
  value: any,
  // biome-ignore lint/suspicious/noExplicitAny: JSON.stringify signature
  replacer?: ((this: any, key: string, value: any) => any) | null,
  space?: string | number,
) {
  const res = JSON.stringify(
    value,
    (key, value_) => {
      const value__ = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value__) : value__;
    },
    space,
  );
  return res;
}
