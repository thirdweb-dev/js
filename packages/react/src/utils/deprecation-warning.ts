export function showDeprecationWarning(
  deprecated: string,
  replacement: string,
) {
  try {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `\`${deprecated}\` is deprecated and will be removed in a future version. Please use \`${replacement}\` instead.`,
      );
    }
  } catch (e) {
    // do nothing
  }
}
