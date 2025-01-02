import { isBrowser } from "../../utils/platform.js";
import type { AppMetadata } from "../types.js";

/**
 * @internal
 */
export function getDefaultAppMetadata(): Required<AppMetadata> {
  if (!isBrowser()) {
    return {
      name: "thirdweb powered dApp",
      url: "https://thirdweb.com",
      description: "thirdweb powered dApp",
      logoUrl: "https://thirdweb.com/favicon.ico",
    };
  }

  const { protocol, hostname, port } = window.location;
  let baseUrl = `${protocol}//${hostname}`;

  // Add the port if it's not the default HTTP or HTTPS port
  if (port && port !== "80" && port !== "443") {
    baseUrl += `:${port}`;
  }

  const logoUrl = `${baseUrl}/favicon.ico`;

  return {
    name: window.document.title || "thirdweb powered dApp",
    url: baseUrl,
    description: window.document.title || "thirdweb powered dApp",
    logoUrl,
  };
}
