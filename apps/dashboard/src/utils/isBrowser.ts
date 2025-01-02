import { hasWindow } from "./helper";

export function isBrowser(): boolean {
  return hasWindow;
}
