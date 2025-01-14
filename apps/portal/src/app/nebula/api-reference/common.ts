import type { APIParameter } from "../../../components/Document/APIEndpointMeta/ApiEndpoint";

export const nebulaFullSessionResponse = `\
{
  "result": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "account_id": "string",
    "model_name": "string",
    "is_public": true,
    "execute_config": {
      "mode": "client",
      "signer_wallet_address": "string",
      "engine_url": "string",
      "engine_authorization_token": "string",
      "engine_backend_wallet_address": "string",
      "smart_account_address": "string",
      "smart_account_factory_address": "string",
      "smart_account_session_key": "string"
    },
    "title": "string",
    "memory": [
      {}
    ],
    "history": [
      {}
    ],
    "action": [
      {}
    ],
    "context_filter": {
      "chain_ids": [
        "1", "137"
      ],
      "contract_addresses": [
        "0x..."
      ],
      "wallet_addresses": [
        "0x..."
      ]
    },
    "archive_at": "2025-01-08T17:22:45.016Z",
    "deleted_at": "2025-01-08T17:22:45.016Z",
    "created_at": "2025-01-08T17:22:45.016Z",
    "updated_at": "2025-01-08T17:22:45.016Z"
  }
}`;

export const nebulaAPI401Response = `\
{
  "error": {
    "message": "401: Authentication failed"
  }
}`;

export const nebulaAPI422Response = `\
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}`;

export const nebulaExecuteConfigType = `\
{
  mode: "engine";
  engine_url: string;
  engine_authorization_token: string;
  engine_backend_wallet_address: string;
} | {
  mode: "session_key";
  smart_account_address: string;
  smart_account_factory_address: string;
  smart_account_session_key: string;
} | {
  mode: "client";
  signer_wallet_address: string;
}`;

export const nebulaContextFilterType = `\
{
  chainIds: string[] | null;
  contractAddresses: string[] | null;
  walletAddresses: string[] | null;
}`;

export const nebulaSecretKeyHeaderParameter: APIParameter = {
  name: "x-secret-key",
  required: true,
  description: "Your thirdweb secret key for authentication.",
  type: "string",
  example: "YOUR_THIRDWEB_SECRET_KEY",
};

export const nebulaSessionIdPathParameter: APIParameter = {
  name: "session_id",
  required: true,
  description: "The unique ID of the session",
  type: "string",
  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
};

export const nebulaExecuteConfigPathParameter: APIParameter = {
  name: "execute_config",
  required: false,
  description: "The configuration for transaction execution",
  type: nebulaExecuteConfigType,
  example: {
    mode: "client",
    signer_wallet_address: "0xc3F2b2a12Eba0f5989cD75B2964E31D56603a2cE",
  },
};

export const nebulaContextFilterPathParameter: APIParameter = {
  name: "context_filter",
  required: false,
  description: "Provide additional context information along with the message",
  type: nebulaContextFilterType,
};
