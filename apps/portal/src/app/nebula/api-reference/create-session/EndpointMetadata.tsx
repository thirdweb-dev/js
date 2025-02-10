import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaAPI422Response,
  nebulaContextParameter,
  nebulaFullSessionResponse,
  nebulaSecretKeyHeaderParameter,
} from "../common";

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        title: "Create Session",
        description: "Creates a new session.",
        path: "/session",
        origin: "https://nebula-api.thirdweb.com",
        method: "POST",
        request: {
          headers: [nebulaSecretKeyHeaderParameter],
          pathParameters: [],
          bodyParameters: [
            {
              name: "title",
              description: "Set a custom title for the session.",
              type: "string",
              required: false,
            },
            nebulaContextParameter,
          ],
        },
        responseExamples: {
          200: nebulaFullSessionResponse,
          401: nebulaAPI401Response,
          422: nebulaAPI422Response,
        },
      }}
    />
  );
}
