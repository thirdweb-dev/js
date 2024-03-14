const ANALYTICS_ENDPOINT = "https://c.thirdweb.com/event";

/**
 * @internal
 */
export function track(clientId: string, data: object) {
  import("./headers.js").then((module) => {
    const { getAnalyticsHeaders } = module;
    fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        ...getAnalyticsHeaders(),
      },
      body: JSON.stringify(data),
    });
  });
}
