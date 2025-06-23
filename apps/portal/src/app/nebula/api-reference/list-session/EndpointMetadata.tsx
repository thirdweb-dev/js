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
        description: "Fetches a list of all available sessions.",
        method: "GET",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/list",
        request: {
          bodyParameters: [],
          headers: [nebulaSecretKeyHeaderParameter],
          pathParameters: [],
        },
        responseExamples: {
          200: response200Example,
          401: nebulaAPI401Response,
        },
        title: "List Sessions",
      }}
    />
  );
}
