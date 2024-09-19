const MAX_LENGTH = 256;
const NUMERIC_IDENTIFIER = "0|[1-9]\\d*";
const MAIN_VERSION_IDENTIFIER = `(${NUMERIC_IDENTIFIER})\\.(${NUMERIC_IDENTIFIER})\\.(${NUMERIC_IDENTIFIER})`;
const REGEX_MAIN_VERSION = new RegExp(MAIN_VERSION_IDENTIFIER);

/**
 * @internal
 */
export type Semver = {
  major: number;
  minor: number;
  patch: number;
  versionString: string;
};

/**
 * @internal
 * @param version - The version to convert to a Semver
 */
export function toSemver(version: string): Semver {
  if (version.length > MAX_LENGTH) {
    throw new Error(`version is longer than ${MAX_LENGTH} characters`);
  }
  const matches = version.trim().match(REGEX_MAIN_VERSION);
  if (!matches || matches?.length !== 4) {
    throw new Error(
      `${version} is not a valid semantic version. Should be in the format of major.minor.patch. Ex: 0.4.1`,
    );
  }
  const major = Number(matches[1]);
  const minor = Number(matches[2]);
  const patch = Number(matches[3]);
  const versionString = [major, minor, patch].join(".");
  return {
    major,
    minor,
    patch,
    versionString,
  };
}

/**
 * @internal
 * @param current - The current version
 * @param next - The next version
 */
export function isIncrementalVersion(current: string, next: string) {
  const currentSemver = toSemver(current);
  const nextSemver = toSemver(next);
  if (nextSemver.major > currentSemver.major) {
    return true;
  }
  const eqMajor = nextSemver.major === currentSemver.major;
  if (eqMajor && nextSemver.minor > currentSemver.minor) {
    return true;
  }
  const eqMinor = nextSemver.minor === currentSemver.minor;
  return eqMajor && eqMinor && nextSemver.patch > currentSemver.patch;
}

/**
 * @internal
 */
export function isDowngradeVersion(current: string, next: string) {
  const currentSemver = toSemver(current);
  const nextSemver = toSemver(next);
  if (nextSemver.major < currentSemver.major) {
    return true;
  }
  const eqMajor = nextSemver.major === currentSemver.major;
  if (eqMajor && nextSemver.minor < currentSemver.minor) {
    return true;
  }
  const eqMinor = nextSemver.minor === currentSemver.minor;
  return eqMajor && eqMinor && nextSemver.patch < currentSemver.patch;
}
