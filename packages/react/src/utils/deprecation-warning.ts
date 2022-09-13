const warnSet = new Set<`${string}:${string}`>();

export const showDeprecationWarning =
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  process.env.NODE_ENV !== "production"
    ? (deprecated: string, replacement: string) => {
        if (warnSet.has(`${deprecated}:${replacement}`)) {
          return;
        }
        warnSet.add(`${deprecated}:${replacement}`);
        console.warn(
          `\`${deprecated}\` is deprecated and will be removed in a future version. Please use \`${replacement}\` instead.`,
        );
      }
    : () => undefined;
