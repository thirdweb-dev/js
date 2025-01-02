import { redirect as nextRedirect } from "next/navigation";
import { isMultiTenant } from "./utils";

/**
 * Wraps Next's redirect to add the ecosystem ID if we're in development mode.
 * In dev, we don't use subdomains. We can't move this to middleware because the edge runtime does not support the JWT verification.
 */
export function redirect(path: string, ecosystemId: string) {
  if (isMultiTenant) {
    return nextRedirect(`/${ecosystemId}${path}`);
  }
  return nextRedirect(path);
}
