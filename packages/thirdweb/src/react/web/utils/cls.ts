/**
 * @internal
 * Utility for merging class names
 *
 * @example
 * ```ts
 * cls("foo", "bar", true, false, "baz") // "foo bar baz"
 * cls('foo', someCondition && "bar") // "foo bar" or "foo"
 * ```
 */
export function cls(...classes: (string | unknown)[]) {
  return classes.filter((v) => typeof v === "string").join(" ");
}
