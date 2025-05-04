import type { Config } from "@hey-api/client-fetch";
import { client } from "./client/client.gen.js";

export type EngineClientOptions = {
  readonly clientId: string;
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
    ...(options.override ?? {}),
  });
}
