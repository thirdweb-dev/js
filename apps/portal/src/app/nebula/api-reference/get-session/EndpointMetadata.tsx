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
        title: "Obtener Sesión",
        description: "Obtener detalles de una sesión por ID",
        path: "/session/{session_id}",
        origin: "https://nebula-api.thirdweb.com",
        method: "GET",
        request: {
          pathParameters: [nebulaSessionIdPathParameter],
          headers: [nebulaSecretKeyHeaderParameter],
          bodyParameters: [],
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
