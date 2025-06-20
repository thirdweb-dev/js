import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaAPI422Response,
  nebulaContextParameter,
  nebulaSecretKeyHeaderParameter,
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
        description: (
          <>
            Executes a specified action. <br /> It is similar to /chat but it
            only handles transaction requests. It is designed to be used without
            history context.
          </>
        ),
        method: "POST",
        origin: "https://nebula-api.thirdweb.com",
        path: "/execute",
        request: {
          bodyParameters: [
            {
              description: "The message to be processed.",
              example: "Hello",
              name: "message",
              required: true,
              type: "string",
            },
            {
              description: "Whether to stream the response or not",
              example: false,
              name: "stream",
              required: false,
              type: "boolean",
            },
            {
              description:
                "The session ID to associate with the message. If not provided, a new session will be created.",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              name: "session_id",
              required: false,
              type: "string",
            },
            nebulaContextParameter,
          ],
          headers: [nebulaSecretKeyHeaderParameter],
          pathParameters: [],
        },
        responseExamples: {
          200: response200Example,
          401: nebulaAPI401Response,
          422: nebulaAPI422Response,
        },
        title: "Execute Action",
      }}
    />
  );
}
