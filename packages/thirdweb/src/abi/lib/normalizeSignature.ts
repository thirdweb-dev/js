// extracted from `viem`: https://github.com/wevm/viem/blob/main/src/utils/hash/normalizeSignature.ts#L8
// missing export
// TODO: upstream exporting this from `viem` and then remove this file

/**
 * Normalizes a signature by removing unnecessary characters and spaces.
 *
 * @param signature - The signature to be normalized.
 * @returns The normalized signature.
 * @throws Error if the signature cannot be normalized.
 * @internal
 */
export function normalizeSignature(signature: string): string {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;

  for (let i = 0; i < signature.length; i++) {
    const char = signature[i];

    // If the character is a separator, we want to reactivate.
    if (["(", ")", ","].includes(char as string)) {
      active = true;
    }

    // If the character is a "level" token, we want to increment/decrement.
    if (char === "(") {
      level++;
    }
    if (char === ")") {
      level--;
    }

    // If we aren't active, we don't want to mutate the result.
    if (!active) {
      continue;
    }

    // If level === 0, we are at the definition level.
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result)) {
        result = "";
      } else {
        result += char;

        // If we are at the end of the definition, we must be finished.
        if (char === ")") {
          valid = true;
          break;
        }
      }

      continue;
    }

    // Ignore spaces
    if (char === " ") {
      // If the previous character is a separator, and the current section isn't empty, we want to deactivate.
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }

    result += char;
    current += char;
  }

  if (!valid) {
    throw new Error("Unable to normalize signature.");
  }

  return result;
}
