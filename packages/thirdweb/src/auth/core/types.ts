import type { ThirdwebClient } from "../../client/client.js";
import type { Account } from "../../wallets/interfaces/wallet.js";

export type AuthOptions = {
  domain: string;
  client?: ThirdwebClient;
  adminAccount?: Account;
  login?: {
    payloadExpirationTimeSeconds?: number;
    statement?: string;
    version?: string;
    nonce?: {
      generate: () => string | Promise<string>;
      validate: (nonce: string) => boolean | Promise<boolean>;
    };
    uri?: string;
    resources?: string[];
  };
  jwt?: {
    expirationTimeSeconds?: number;
    jwtId?: {
      generate: () => string | Promise<string>;
      validate: (jwtId: string) => boolean | Promise<boolean>;
    };
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
