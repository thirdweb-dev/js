import type { AppMetadata } from "../types.js";

/**
 * @internal
 */
export function getDefaultAppMetadata(): Required<AppMetadata> {
  if (typeof window === "undefined") {
    return {
      name: "thirdweb powered dApp",
      url: "https://thirdweb.com",
      description: "thirdweb powered dApp",
      logoUrl: "https://thirdweb.com/favicon.ico",
    };
  }

  const domain = window.location.hostname;
  const faviconUrlFullPath = `${domain}/favicon.ico`;

  return {
    name: window.document.title,
    url: domain,
    description: window.document.title,
    logoUrl: faviconUrlFullPath,
  };
}
