import { ApiEndpoint } from "@/components/Document/APIEndpointMeta/ApiEndpoint";
import {
  nebulaAPI401Response,
  nebulaAPI422Response,
  nebulaContextFilterPathParameter,
  nebulaExecuteConfigPathParameter,
  nebulaFullSessionResponse,
  nebulaSecretKeyHeaderParameter,
  nebulaSessionIdPathParameter,
} from "../common";

export function EndpointMetadata() {
  return (
    <ApiEndpoint
      metadata={{
        title: "Update Session",
        method: "PUT",
        description:
          "Update session details like title, context_filter, execute_config, etc.",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/{session_id}",
        request: {
          pathParameters: [nebulaSessionIdPathParameter],
          headers: [nebulaSecretKeyHeaderParameter],
          bodyParameters: [
            {
              name: "title",
              description: "Set a custom title for the session.",
              type: "string",
              required: false,
            },
            nebulaExecuteConfigPathParameter,
            nebulaContextFilterPathParameter,
          ],
        },
        responseExamples: {
          200: nebulaFullSessionResponse,
          422: nebulaAPI422Response,
          401: nebulaAPI401Response,
        },
      }}
    />
  );
}
