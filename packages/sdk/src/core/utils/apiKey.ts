let alreadyChecked = false;
export function checkClientIdOrSecretKey(
  message: string,
  clientId?: string,
  secretKey?: string,
) {
  if (alreadyChecked) {
    return;
  }
  alreadyChecked = true;

  // also check for global auth token (set via CLI or dashboard for example)
  const hasGlobalAuthToken =
    //   CLI
    (typeof globalThis !== "undefined" &&
      "TW_CLI_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string") ||
    //   Dashboard
    (typeof globalThis !== "undefined" &&
      "TW_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_AUTH_TOKEN === "string");
  // check the prerequisites
  if (clientId || secretKey || hasGlobalAuthToken) {
    return;
  }

  console.warn(message);
}
