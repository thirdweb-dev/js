import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaAPI422Response,
  nebulaContextFilterPathParameter,
  nebulaExecuteConfigPathParameter,
  nebulaSecretKeyHeaderParameter,
  nebulaSessionIdPathParameter,
} from "../common";

const response200Example = `\
{
  "message": "string",
  "actions": [
    {
      "session_id": "string",
      "request_id": "string",
      "type": "init",
      "source": "string",
      "data": "string"
    }
  ],
  "session_id": "string",
  "request_id": "string"
}`;

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        title: "Send Message",
        description: "Process a chat message and return the response",
        origin: "https://nebula-api.thirdweb.com",
        path: "/chat",
        method: "POST",
        request: {
          pathParameters: [],
          headers: [nebulaSecretKeyHeaderParameter],
          bodyParameters: [
            {
              name: "message",
              required: true,
              description: "The message to be processed.",
              type: "string",
              example: "Hello",
            },
            {
              name: "stream",
              required: false,
              description: "Whether to stream the response or not",
              type: "boolean",
              example: false,
            },
            {
              ...nebulaSessionIdPathParameter,
              required: false,
              description:
                "The session ID to associate with the message. If not provided, a new session will be created.",
            },
            nebulaExecuteConfigPathParameter,
            nebulaContextFilterPathParameter,
          ],
        },
        responseExamples: {
          200: response200Example,
          401: nebulaAPI401Response,
          422: nebulaAPI422Response,
        },
      }}
    />
  );
}
