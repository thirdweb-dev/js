import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaAPI422Response,
  nebulaContextParameter,
  nebulaFullSessionResponse,
  nebulaSecretKeyHeaderParameter,
  nebulaSessionIdPathParameter,
} from "../common";

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        description: "Update session details like title, context, etc.",
        method: "PUT",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/{session_id}",
        referenceUrl: "/reference#tag/ai/ai/update-session",
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
          pathParameters: [nebulaSessionIdPathParameter],
          queryParameters: [],
        },
        responseExamples: {
          200: nebulaFullSessionResponse,
          401: nebulaAPI401Response,
          422: nebulaAPI422Response,
        },
        title: "Update Session",
      }}
    />
  );
}
