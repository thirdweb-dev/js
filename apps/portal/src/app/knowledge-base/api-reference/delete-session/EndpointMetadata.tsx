import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaAPI422Response,
  nebulaSecretKeyHeaderParameter,
  nebulaSessionIdPathParameter,
} from "../common";

const response200Example = `\
{
  "result": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "deleted_at": "2025-01-08T19:27:37.296Z"
  }
}`;

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        title: "Delete Session",
        method: "DELETE",
        description: "Deletes a session by ID",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/{session_id}",
        request: {
          pathParameters: [nebulaSessionIdPathParameter],
          headers: [nebulaSecretKeyHeaderParameter],
          bodyParameters: [],
        },
        responseExamples: {
          200: response200Example,
          422: nebulaAPI422Response,
          401: nebulaAPI401Response,
        },
      }}
    />
  );
}
