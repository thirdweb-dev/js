import type { Config } from "@hey-api/client-fetch";
import { client } from "./client/client.gen.js";

export type EngineClientOptions = {
  readonly clientId?: string;
  readonly secretKey?: string;
};

export function configure(
  options: EngineClientOptions & { override?: Config },
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
