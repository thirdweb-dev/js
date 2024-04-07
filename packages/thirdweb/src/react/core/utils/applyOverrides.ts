// biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
export type DeepPartial<T extends Record<string, any>> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Create a new object with given overrides object applied on top of given base object without mutating the base and overrides object
 *
 * @param defaultObj - The object to use as the base object
 * @param overrides - The object to use as the overrides
 *
 * @internal
 */
// biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
export function immutableOverride<T extends Record<string, any>>(
  defaultObj: T,
  overrides: DeepPartial<T>,
): T {
  const output = { ...defaultObj };

  for (const key in overrides) {
    const value = overrides[key];
    // only apply overrides if it is not undefined
    if (value !== undefined) {
      // partially apply overrides object
      if (typeof value === "object" && value !== null) {
        output[key] = immutableOverride(defaultObj[key], value);
      }
      // completely override non-object values
      else {
        output[key] = value;
      }
    }
  }

  return output;
}
