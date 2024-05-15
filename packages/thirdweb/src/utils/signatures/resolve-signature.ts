const function_cache = new Map<string, string>();
const event_cache = new Map<string, string>();

type FunctionString = `function ${string}`;
type EventString = `event ${string}`;

// TODO: investigate a better source for this
const SIGNATURE_API = "https://www.4byte.directory/api/v1";

async function resolveFunctionSignature(
  hexSig: string,
): Promise<FunctionString | null> {
  if (function_cache.has(hexSig)) {
    return function_cache.get(hexSig) as FunctionString;
  }
  const res = await fetch(
    `${SIGNATURE_API}/signatures/?format=json&hex_signature=${hexSig}`,
  );
  if (!res.ok) {
    res.body?.cancel();
    console.log(res.statusText);
    return null;
  }
  const data = await res.json();
  if (data.count === 0) {
    return null;
  }
  const signature = `function ${data.results[0].text_signature}` as const;
  function_cache.set(hexSig, signature);
  return signature;
}

async function resolveEventSignature(
  hexSig: string,
): Promise<EventString | null> {
  if (event_cache.has(hexSig)) {
    return event_cache.get(hexSig) as EventString;
  }
  const res = await fetch(
    `${SIGNATURE_API}/event-signatures/?format=json&hex_signature=${hexSig}`,
  );
  if (!res.ok) {
    res.body?.cancel();
    console.log(res.statusText);
    return null;
  }
  const data = await res.json();
  if (data.count === 0) {
    return null;
  }

  const signature = `event ${uppercaseFirstLetter(
    data.results[0].text_signature,
  )}` as const;
  event_cache.set(hexSig, signature);
  return signature;
}
// helper
function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Resolves a signature by converting a hexadecimal string into a function or event signature.
 * @param hexSig The hexadecimal signature to resolve.
 * @returns A promise that resolves to an object containing the function and event signatures.
 * @example
 * ```ts
 * import { resolveSignature } from "thirdweb/utils";
 * const res = await resolveSignature("0x1f931c1c");
 * console.log(res);
 * ```
 * @utils
 */
export async function resolveSignature(hexSig: string): Promise<{
  function: FunctionString | null;
  event: EventString | null;
}> {
  if (hexSig.startsWith("0x")) {
    // biome-ignore lint/style/noParameterAssign: modifying in-place for performance
    hexSig = hexSig.slice(2);
  }
  const all = await Promise.all([
    resolveFunctionSignature(hexSig),
    resolveEventSignature(hexSig),
  ]);
  return {
    function: all[0],
    event: all[1],
  };
}

/**
 * Resolves the signatures of the given hexadecimal signatures.
 * @param hexSigs An array of hexadecimal signatures.
 * @returns A promise that resolves to an object containing the resolved functions and events.
 * @example
 * ```ts
 * import { resolveSignatures } from "thirdweb/utils";
 * const res = await resolveSignatures(["0x1f931c1c", "0x1f931c1c"]);
 * console.log(res);
 * ```
 * @utils
 */
export async function resolveSignatures(hexSigs: string[]): Promise<{
  functions: FunctionString[];
  events: EventString[];
}> {
  // dedupe hexSigs
  // biome-ignore lint/style/noParameterAssign: modifying in-place for performance
  hexSigs = Array.from(new Set(hexSigs));
  const all = await Promise.all(
    hexSigs.map((hexSig) => resolveSignature(hexSig)),
  );
  return {
    functions: all
      .map((x) => x.function)
      .filter((x) => x !== null)
      .sort() as FunctionString[],
    events: all
      .map((x) => x.event)
      .filter((x) => x !== null)
      .sort() as EventString[],
  };
}

/**
 * @internal
 */
export function clearCache() {
  function_cache.clear();
  event_cache.clear();
}
