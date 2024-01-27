import type { TxOpts } from "../transaction/transaction.js";

const EXTENSION_ID = /* @__PURE__ */ Symbol("extension_id");

/**
 * Represents a function type for a "read" extension.
 */
export type ReadExtension<
  params extends object,
  result,
  extension_id extends string,
> = {
  (options: TxOpts<params>): Promise<result>;
  [EXTENSION_ID]: extension_id;
};

/**
 * Creates a read extension with the specified ID.
 * @param id - The ID of the extension.
 * @returns A function that takes a callback function and returns a read extension.
 * @internal
 */
export function createReadExtension<extension_id extends string>(
  id: extension_id,
) {
  return <params extends object, result>(
    fn: (options: TxOpts<params>) => Promise<result>,
  ) => {
    const ext = fn as ReadExtension<params, result, extension_id>;
    ext[EXTENSION_ID] = id;
    return ext;
  };
}

export function isReadExtension<id extends string, A extends object, T>(
  fn: any,
): fn is ReadExtension<A, T, id> {
  return typeof fn === "function" && EXTENSION_ID in fn;
}

/**
 * Retrieves the extension ID from the given extension object.
 * @param extension - The extension function.
 * @returns The extension ID.
 * @internal
 */
export function getExtensionId<A extends object, T, id extends string>(
  extension: ReadExtension<A, T, id>,
) {
  return extension[EXTENSION_ID];
}
