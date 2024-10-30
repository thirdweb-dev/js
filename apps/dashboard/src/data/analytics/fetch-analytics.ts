import "server-only";

export async function fetchAnalytics(input: string | URL, init?: RequestInit) {
  const [pathname, searchParams] = input.toString().split("?");
  if (!pathname) {
    throw new Error("Invalid input, no pathname provided");
  }

  // create a new URL object for the analytics server
  const API_SERVER_URL = new URL(
    process.env.ANALYTICS_SERVICE_URL || "https://analytics.thirdweb.com",
  );
  API_SERVER_URL.pathname = pathname;
  for (const param of searchParams?.split("&") || []) {
    const [key, value] = param.split("=");
    if (!key || !value) {
      return;
    }
    API_SERVER_URL.searchParams.append(
      decodeURIComponent(key),
      decodeURIComponent(value),
    );
  }

  return await fetch(API_SERVER_URL, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.ANALYTICS_SERVICE_API_KEY}`,
      ...init?.headers,
    },
  });
}
