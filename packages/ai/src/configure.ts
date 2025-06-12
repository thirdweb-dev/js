import type { Config } from "@hey-api/client-fetch";
import type { ThirdwebClient } from "thirdweb";
import { client } from "./client/client.gen.js";

export type NebulaClientOptions = {
  readonly clientId?: string;
  readonly secretKey?: string;
};

export function configure(
  options: NebulaClientOptions & { override?: Config },
) {
  client.setConfig({
    headers: {
      ...(options.clientId && { "x-client-id": options.clientId }),
      ...(options.secretKey && { "x-secret-key": options.secretKey }),
    },
    bodySerializer: stringify,
    ...(options.override ?? {}),
  });
}

export function configureWithClient(
  twClient: ThirdwebClient,
  override?: Config,
) {
  client.setConfig({
    headers: {
      ...(twClient.clientId && { "x-client-id": twClient.clientId }),
      ...(twClient.secretKey && { "x-secret-key": twClient.secretKey }),
    },
    bodySerializer: stringify,
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
