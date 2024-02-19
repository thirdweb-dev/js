let backendVersion = 1;

/**
 * @internal
 */
export function getBackendVersion() {
  return backendVersion;
}

/**
 * Set backend version for the embedded wallet service
 * @param version - The version number
 * @example
 * ```ts
 * setBackendVersion(2);
 * ```
 */
export function setBackendVersion(version: number) {
  backendVersion = version;
}
