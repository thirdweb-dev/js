import {
  type APIParameter,
  ApiEndpoint,
} from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import { secretKeyHeaderParameter } from "../../../components/Document/APIEndpointMeta/common";

const contextFilterType = `\
{
  from: string | null;
  chain_ids: string[] | null;
  session_id: string | null;
}`;

const contextParameter: APIParameter = {
  description: "Provide additional context information along with the message",
  name: "context",
  required: false,
  type: contextFilterType,
  example: {
    from: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
    chain_ids: [8453],
  },
};

const response200Example = `\
{
  "message": "I've prepared a native ETH transfer as requested. Would you like to proceed with executing this transfer?",
  "session_id": "123",
  "request_id": "456",
  "actions": [
    {
      "type": "sign_transaction",
      "data": {
        "chainId": 8453,
        "to": "0x1234567890123456789012345678901234567890",
        "value": "10000000000000000",
        "data": "0x"
      },
      "session_id": "123",
      "request_id": "456",
      "source": "model",
      "tool_name": null,
      "description": null,
      "kwargs": null
    }
  ]
}`;

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        description:
          "Send requests to the thirdweb AI model and receive a responses.",
        method: "POST",
        origin: "https://api.thirdweb.com",
        path: "/ai/chat",
        request: {
          bodyParameters: [
            {
              description: "The message to be processed.",
              example: [
                {
                  role: "user",
                  content: "Transfer 10 USDC to vitalik.eth",
                },
              ],
              name: "messages",
              required: true,
              type: "array",
            },
            {
              description: "Whether to stream the response or not",
              example: false,
              name: "stream",
              required: false,
              type: "boolean",
            },
            contextParameter,
          ],
          headers: [secretKeyHeaderParameter],
          pathParameters: [],
        },
        responseExamples: {
          200: response200Example,
        },
        title: "Chat via HTTP API",
      }}
    />
  );
}
