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
        title: "Execute Action",
        description: (
          <>
            Executes a specified action. <br /> It is similar to /chat but it
            only handles transaction requests. It is designed to be used without
            history context.
          </>
        ),
        path: "/execute",
        origin: "https://nebula-api.thirdweb.com",
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
              name: "session_id",
              type: "string",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              required: false,
              description:
                "The session ID to associate with the message. If not provided, a new session will be created.",
            },
            nebulaContextParameter,
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
