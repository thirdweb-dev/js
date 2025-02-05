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
        title: "Borrar Sesión",
        description:
          "Elimina todos los mensajes de una sesión específica utilizando el ID de la sesión.",
        origin: "https://nebula-api.thirdweb.com",
        path: "/session/{session_id}/clear",
        method: "POST",
        request: {
          pathParameters: [nebulaSessionIdPathParameter],
          headers: [nebulaSecretKeyHeaderParameter],
          bodyParameters: [],
        },
        responseExamples: {
          200: nebulaFullSessionResponse,
          401: nebulaAPI401Response,
        },
      }}
    />
  );
}
