export const ERROR_SUBSTRINGS = [
  "eip-155",
  "protected",
  "invalid chain id for signer",
  "chain id none",
  "chain_id mismatch",
];

export const ERROR_SUBSTRINGS_COMPOSITE = [["account", "not found"]];

export function matchError(error: string): boolean {
  const errorIndex = ERROR_SUBSTRINGS.findIndex((substring) =>
    error.includes(substring),
  );

  const compositeErrorIndex = ERROR_SUBSTRINGS_COMPOSITE.findIndex((arr) => {
    let foundError = true;
    arr.forEach((substring) => {
      foundError &&= error.includes(substring);
    });

    return foundError;
  });

  return errorIndex !== -1 || compositeErrorIndex !== -1;
}
