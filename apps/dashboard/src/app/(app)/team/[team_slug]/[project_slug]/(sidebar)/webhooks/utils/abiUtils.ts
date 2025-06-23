import { keccak256, toFunctionSelector } from "thirdweb/utils";
import type { AbiData } from "./webhookTypes";

/**
 * Truncates a string in the middle for display purposes
 * @param str String to truncate
 * @param startChars Number of characters to keep at the start
 * @param endChars Number of characters to keep at the end
 * @returns Truncated string
 */
export const truncateMiddle = (
  str: string,
  startChars = 6,
  endChars = 4,
): string => {
  if (!str) return "None";
  if (str.length <= startChars + endChars) return str;
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
};

function isAbiInput(
  input: unknown,
): input is { type: string; indexed?: boolean; name?: string } {
  return (
    typeof input === "object" &&
    input !== null &&
    typeof (input as { type?: unknown }).type === "string"
  );
}

// Helper to recursively get canonical type for ABI input (handles tuples)
function getCanonicalType(input: any): string {
  if (input.type.startsWith("tuple")) {
    // Recursively build tuple type string
    const components = input.components || [];
    const tupleType = `(${components.map(getCanonicalType).join(",")})`;
    // Handle tuple arrays (tuple[], tuple[2], etc)
    const arraySuffix = input.type.slice("tuple".length);
    return tupleType + arraySuffix;
  }
  return input.type;
}

/**
 * Extracts event signatures from ABI data
 * @param abiData Array of ABI data objects
 * @returns Array of event signatures with name, signature hash, and ABI
 */
export const extractEventSignatures = (
  abiData: AbiData[],
): Array<{ name: string; signature: string; abi?: string }> => {
  try {
    const signatures: Array<{
      name: string;
      signature: string;
      abi?: string;
    }> = [];

    // Iterate through all ABIs
    for (const abiObj of abiData) {
      if (abiObj && typeof abiObj === "object") {
        const abi = abiObj.abi;

        // If we have a valid ABI array, extract event signatures
        if (Array.isArray(abi)) {
          // Filter to only include events
          const events = abi.filter(
            (item) => item && typeof item === "object" && item.type === "event",
          );

          // Create signatures for each event
          for (const event of events) {
            if (event && typeof event === "object" && event.name) {
              // Create a signature string that includes inputs
              const eventName = event.name as string;
              const inputs = Array.isArray(event.inputs)
                ? event.inputs
                    .filter((input: unknown) => isAbiInput(input))
                    .map(
                      (input: {
                        type: string;
                        indexed?: boolean;
                        name?: string;
                      }) => `${input.type} ${input.name || ""}`,
                    )
                    .join(", ")
                : "";

              // Create a human-readable signature for display
              const readableSignature = `${eventName}(${inputs})`;

              // Create the canonical signature for hashing (without parameter names and indexed)
              const canonicalInputs = Array.isArray(event.inputs)
                ? event.inputs
                    .filter((input: unknown) => isAbiInput(input))
                    .map((input: any) => getCanonicalType(input))
                    .join(",")
                : "";

              const canonicalSignature = `${eventName}(${canonicalInputs})`;

              // Generate the proper Ethereum event signature hash using keccak256
              // Use proper UTF-8 encoding for the signature
              const encoder = new TextEncoder();
              const signatureBytes = encoder.encode(canonicalSignature);
              const hash = keccak256(signatureBytes);

              // Stringify the event ABI for inclusion in the payload
              const eventAbi = JSON.stringify(event);

              signatures.push({
                abi: eventAbi,
                name: readableSignature, // Use the full hash, not a substring
                signature: hash, // Include the ABI for the selected event
              });
            }
          }
        }
      }
    }

    return signatures;
  } catch (err) {
    console.error("Error extracting event signatures:", err);
    return [];
  }
};

/**
 * Extracts function signatures from ABI data
 * @param abiData Array of ABI data objects
 * @returns Array of function signatures with name, selector, and ABI
 */
export const extractFunctionSignatures = (
  abiData: AbiData[],
): Array<{ name: string; signature: string; abi?: string }> => {
  try {
    const signatures: { name: string; signature: string; abi?: string }[] = [];

    // Iterate through all ABIs
    for (const abiObj of abiData) {
      if (abiObj && typeof abiObj === "object") {
        const abi = abiObj.abi;

        // If we have a valid ABI array, extract function signatures
        if (Array.isArray(abi)) {
          // Filter to only include functions
          const functions = abi.filter(
            (item) =>
              item && typeof item === "object" && item.type === "function",
          );

          // Create signatures for each function
          for (const func of functions) {
            if (func && typeof func === "object" && func.name) {
              // Create a readable signature string for UI display
              const funcName = func.name as string;
              const inputs = Array.isArray(func.inputs)
                ? func.inputs
                    .filter((input: unknown) => isAbiInput(input))
                    .map(
                      (input: {
                        type: string;
                        indexed?: boolean;
                        name?: string;
                      }) => `${input.type} ${input.name || ""}`,
                    )
                    .join(", ")
                : "";

              // Create a human-readable signature for display
              const readableSignature = `${funcName}(${inputs})`;

              // Create the canonical signature for function selector
              const canonicalInputs = Array.isArray(func.inputs)
                ? func.inputs
                    .filter((input: unknown) => isAbiInput(input))
                    .map((input: any) => getCanonicalType(input))
                    .join(",")
                : "";

              const canonicalSignature = `${funcName}(${canonicalInputs})`;

              // Generate the function selector using thirdweb SDK v5
              const hash = toFunctionSelector(canonicalSignature);

              // Stringify the function ABI for inclusion in the payload
              const funcAbi = JSON.stringify(func);

              signatures.push({
                abi: funcAbi,
                name: readableSignature,
                signature: hash, // Include the ABI for the selected function
              });
            }
          }
        }
      }
    }

    return signatures;
  } catch (error) {
    console.error("Error extracting function signatures: ", error);
    return [];
  }
};
