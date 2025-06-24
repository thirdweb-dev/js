import type { Config } from "./client/client/index.js";
import { client } from "./client/client.gen.js";

export type InsightClientOptions = {
  readonly clientId?: string;
  readonly secretKey?: string;
};

export function configure(
  options: InsightClientOptions & { override?: Config },
) {
  client.setConfig({
    headers: {
      ...(options.clientId && { "x-client-id": options.clientId }),
      ...(options.secretKey && { "x-secret-key": options.secretKey }),
    },
    ...(options.override ?? {}),
  });
}
