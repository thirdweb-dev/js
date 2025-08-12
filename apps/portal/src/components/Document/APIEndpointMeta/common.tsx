import type { APIParameter } from "./ApiEndpoint";

export const secretKeyHeaderParameter: APIParameter = {
  description: "Your project secret key for authentication.",
  example: "<your-project-secret-key>",
  name: "x-secret-key",
  required: true,
  type: "string",
};
