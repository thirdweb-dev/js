import type { APIParameter } from "../../../components/Document/APIEndpointMeta/ApiEndpoint";

export const nebulaFullSessionResponse = `\
{
  "result": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "string",
    "context": {
      "chain_ids": ["1", "137"],
      "wallet_address": "0x..."
    },
    "history": [
      {}
    ],
    "account_id": "string",
    "model_name": "string",
    "is_public": true,
    "memory": [
      {}
    ],
    "action": [
      {}
    ],
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

export const nebulaSecretKeyHeaderParameter: APIParameter = {
  description: "Your thirdweb secret key for authentication.",
  example: "YOUR_THIRDWEB_SECRET_KEY",
  name: "x-secret-key",
  required: true,
  type: "string",
};

export const nebulaSessionIdPathParameter: APIParameter = {
  description: "The unique ID of the session",
  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "session_id",
  required: true,
  type: "string",
};
const nebulaContextFilterType = `\
{
  chainIds: string[] | null;
  walletAddress: string | null;
}`;

export const nebulaContextParameter: APIParameter = {
  description: "Provide additional context information along with the message",
  name: "context",
  required: false,
  type: nebulaContextFilterType,
};
