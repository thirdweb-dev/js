export function isReactNative(): boolean {
  return (
    typeof document === "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.product === "ReactNative"
  );
}

export function isNode(): boolean {
  return (
    typeof process !== "undefined" &&
    typeof process.versions !== "undefined" &&
    typeof process.versions.node !== "undefined"
  );
}

export function isBrowser(): boolean {
  return !isReactNative() && !isNode();
}
