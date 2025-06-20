import { isBrowser } from "../../utils/platform.js";
import type { AppMetadata } from "../types.js";

/**
 * @internal
 */
export function getDefaultAppMetadata(): Required<AppMetadata> {
  if (!isBrowser()) {
    return {
      description: "thirdweb powered dApp",
      logoUrl: "https://thirdweb.com/favicon.ico",
      name: "thirdweb powered dApp",
      url: "https://thirdweb.com",
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
    description: window.document.title || "thirdweb powered dApp",
    logoUrl,
    name: window.document.title || "thirdweb powered dApp",
    url: baseUrl,
  };
}
