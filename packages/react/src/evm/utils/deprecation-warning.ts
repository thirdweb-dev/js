import { __DEV__ } from "../constants/runtime";

const warnSet = new Set<`${string}:${string}`>();

export const showDeprecationWarning = (
  deprecated: string,
  replacement: string,
) => {
  // deprecation warnings only in dev only in dev
  if (__DEV__) {
    if (warnSet.has(`${deprecated}:${replacement}`)) {
      return;
    }
    warnSet.add(`${deprecated}:${replacement}`);
    console.warn(
      `\`${deprecated}\` is deprecated and will be removed in a future major version. Please use \`${replacement}\` instead.`,
    );
  }
};
