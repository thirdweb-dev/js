import type { ThirdwebClient } from "../../client/client.js";

export type AuthOptions = {
  domain: string;
  client: ThirdwebClient;
  login?: {
    payloadExpirationTime?: number;
    statement?: string;
    version?: string;
    nonce?: {
      generate: () => string | Promise<string>;
      validate: (nonce: string) => boolean | Promise<boolean>;
    };
    uri?: string;
    resources?: string[];
  };
};

export type LoginPayload = {
  domain: string;
  address: string;
  statement: string;
  uri?: string;
  version: string;
  chain_id?: string;
  nonce: string;
  issued_at: string;
  expiration_time: string;
  invalid_before: string;
  resources?: string[];
};
