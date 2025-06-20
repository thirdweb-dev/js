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
        description: "Creates a new session.",
        method: "POST",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session",
        request: {
          bodyParameters: [
            {
              description: "Set a custom title for the session.",
              name: "title",
              required: false,
              type: "string",
            },
            nebulaContextParameter,
          ],
          headers: [nebulaSecretKeyHeaderParameter],
          pathParameters: [],
        },
        responseExamples: {
          200: nebulaFullSessionResponse,
          401: nebulaAPI401Response,
          422: nebulaAPI422Response,
        },
        title: "Create Session",
      }}
    />
  );
}
