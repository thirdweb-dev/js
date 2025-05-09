import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaSecretKeyHeaderParameter,
} from "../common";

const response200Example = `\
{
  "result": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "string",
      "created_at": "2025-01-08T10:52:40.293Z",
      "updated_at": "2025-01-08T10:52:40.293Z"
    }
  ]
}`;

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        title: "List Sessions",
        description: "Fetches a list of all available sessions.",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/list",
        method: "GET",
        request: {
          pathParameters: [],
          bodyParameters: [],
          headers: [nebulaSecretKeyHeaderParameter],
        },
        responseExamples: {
          200: response200Example,
          401: nebulaAPI401Response,
        },
      }}
    />
  );
}
