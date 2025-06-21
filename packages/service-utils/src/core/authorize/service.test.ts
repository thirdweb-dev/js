import { describe, expect, it } from "vitest";
import {
  validProjectResponse,
  validServiceConfig,
  validTeamAndProjectResponse,
} from "../../mocks.js";
import type { CoreServiceConfig } from "../api.js";
import { authorizeService } from "./service.js";

describe("authorizeService", () => {
  it("should authorize service with valid service scope and action", () => {
    const result = authorizeService(
      validTeamAndProjectResponse,
      validServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.project).toEqual(validProjectResponse);
  });

  it("should not authorize service with unauthorized service scope", () => {
    const invalidServiceConfig: CoreServiceConfig = {
      apiUrl: "https://api.example.com",
      serviceApiKey: "service-api-key",
      serviceScope: "nebula",
    };

    const result = authorizeService(
      validTeamAndProjectResponse,
      invalidServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toContain(
      "Invalid request: Unauthorized service: nebula",
    );
    expect(result.errorCode).toBe("SERVICE_UNAUTHORIZED");
    expect(result.status).toBe(403);
  });

  it("should not authorize service with unauthorized service action", () => {
    const invalidServiceConfig: CoreServiceConfig = {
      apiUrl: "https://api.example.com",
      serviceAction: "unauthorized-action",
      serviceApiKey: "service-api-key",
      serviceScope: "storage",
    };

    const result = authorizeService(
      validTeamAndProjectResponse,
      invalidServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toContain(
      "Invalid request: Unauthorized action: storage unauthorized-action",
    );
    expect(result.errorCode).toBe("SERVICE_ACTION_UNAUTHORIZED");
    expect(result.status).toBe(403);
  });
});
