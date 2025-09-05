import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaFullSessionResponse,
  nebulaSecretKeyHeaderParameter,
  nebulaSessionIdPathParameter,
} from "../common";

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        description:
          "Clears all messages for a specific session using the session ID.",
        method: "POST",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/{session_id}/clear",
        referenceUrl: "/reference#tag/ai/ai/clear-session",
        request: {
          queryParameters: [],
          bodyParameters: [],
          headers: [nebulaSecretKeyHeaderParameter],
          pathParameters: [nebulaSessionIdPathParameter],
        },
        responseExamples: {
          200: nebulaFullSessionResponse,
          401: nebulaAPI401Response,
        },
        title: "Clear Session",
      }}
    />
  );
}
