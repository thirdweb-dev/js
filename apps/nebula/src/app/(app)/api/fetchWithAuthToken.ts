type FetchWithKeyOptions = {
  endpoint: string;
  authToken: string;
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
    const response = await fetch(options.endpoint, {
      body: "body" in options ? JSON.stringify(options.body) : undefined,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${options.authToken}`,
        "Content-Type": "application/json",
      },
      method: options.method,
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 504) {
        throw new Error("Request timed out. Please try again.");
      }

      throw new Error(`HTTP error! status: ${response.status}`);
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
