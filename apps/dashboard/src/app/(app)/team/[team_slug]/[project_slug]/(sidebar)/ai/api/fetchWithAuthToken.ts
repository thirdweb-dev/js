"use server";

import { getAuthToken } from "@/api/auth-token";
import type { Project } from "@/api/project/projects";

type FetchWithKeyOptions = {
  endpoint: string;
  project: Project;
  timeout?: number;
} & (
  | {
      method: "POST" | "PUT";
      body: Record<string, unknown>;
    }
  | {
      method: "GET" | "DELETE";
    }
);

export async function fetchWithAuthToken(options: FetchWithKeyOptions) {
  const timeout = options.timeout || 30000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error("No auth token found");
    }
    const response = await fetch(options.endpoint, {
      body: "body" in options ? JSON.stringify(options.body) : undefined,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
        "x-team-id": options.project.teamId,
        "x-client-id": options.project.publishableKey,
        "Content-Type": "application/json",
      },
      method: options.method,
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 504) {
        throw new Error("Request timed out. Please try again.");
      }

      const data = await response.text();
      throw new Error(`HTTP error! status: ${response.status}: ${data}`);
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
