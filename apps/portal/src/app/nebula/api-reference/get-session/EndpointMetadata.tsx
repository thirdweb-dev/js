import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaAPI422Response,
  nebulaFullSessionResponse,
  nebulaSecretKeyHeaderParameter,
  nebulaSessionIdPathParameter,
} from "../common";

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        description: "Get details of a session by ID",
        method: "GET",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/{session_id}",
        request: {
          bodyParameters: [],
          headers: [nebulaSecretKeyHeaderParameter],
          pathParameters: [nebulaSessionIdPathParameter],
        },
        responseExamples: {
          200: nebulaFullSessionResponse,
          401: nebulaAPI401Response,
          422: nebulaAPI422Response,
        },
        title: "Get Session",
      }}
    />
  );
}
