import {
  type Abi,
  type AbiEvent,
  type AbiFunction,
  formatAbiItem,
  parseAbiItem,
} from "abitype";
import { getCachedChain } from "../../../chains/utils.js";
import { createThirdwebClient } from "../../../client/client.js";
import { resolveAbiFromContractApi } from "../../../contract/actions/resolve-abi.js";
import { getContract } from "../../../contract/contract.js";

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Options } from "prettier";
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { packageDirectory } from "./utils.js";

const client = createThirdwebClient({ clientId: "test" });

export async function generate(input: ChainIdAndContract) {
  const [chainId, contractAddress] = input.split("/");
  if (!chainId || !contractAddress) {
    throw new Error("Invalid chainId and contractAddress");
  }
  const contract = getContract({
    client,
    chain: getCachedChain(Number.parseInt(chainId)),
    address: contractAddress,
  });
  const abi = await resolveAbiFromContractApi(contract);

  if (!abi) {
    throw new Error("No ABI found for contract");
  }

  const generated = await generateFromAbi(abi);

  // find the root of the project
  const root = await packageDirectory();
  if (!root) {
    throw new Error("No root found");
  }
  // create the chain directory
  const hasSource = existsSync(join(root, "src"));

  const path = hasSource ? "src/thirdweb" : "thirdweb";

  const chainDirPath = join(root, path, chainId);

  await mkdir(chainDirPath, { recursive: true });

  await writeFile(
    join(chainDirPath, `${contractAddress.toLowerCase()}.ts`),
    generated,
  );
}

type ChainIdAndContract = `${number}/0x${string}`;

export function isValidChainIdAndContractAddress(
  chainIdPlusContract: unknown,
): chainIdPlusContract is ChainIdAndContract {
  if (typeof chainIdPlusContract !== "string") {
    return false;
  }
  const [chainId, contractAddress] = chainIdPlusContract.split("/");
  if (!chainId || !contractAddress) {
    return false;
  }
  return true;
}

async function generateFromAbi(abi: Abi | string[]) {
  // turn any human readable abi into a proper abi object
  // biome-ignore lint/style/noParameterAssign: TODO: fix later
  abi = abi.map((x) => (typeof x === "string" ? parseAbiItem(x) : x)) as Abi;

  const events = abi.filter((x) => x.type === "event") as AbiEvent[];

  const functions = abi.filter((x) => x.type === "function") as AbiFunction[];

  const overloadedReads = new Set<string>();
  const overloadedWrites = new Set<string>();
  // split functions into read and write
  const readFunctions: AbiFunction[] = [];
  const writeFunctions: AbiFunction[] = [];
  for (const f of functions) {
    if (f.stateMutability === "view" || f.stateMutability === "pure") {
      if (overloadedReads.has(f.name)) {
        continue;
      }
      readFunctions.push(f);
      overloadedReads.add(f.name);
    } else {
      if (overloadedWrites.has(f.name)) {
        continue;
      }
      writeFunctions.push(f);
      overloadedWrites.add(f.name);
    }
  }

  // creat the file body

  let body = `import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";\n\n`;

  if (events.length) {
    body += `/**
* Contract events
*/\n\n`;

    // process every event
    await Promise.all(
      events.map(async (e) => {
        body += `${generateEvent(e)}\n\n`;
      }),
    );
  }
  if (readFunctions.length) {
    body += `/**
* Contract read functions
*/\n\n`;

    // process every read function
    await Promise.all(
      readFunctions.map(async (f) => {
        body += `${generateReadFunction(f)}\n\n`;
      }),
    );
  }
  if (writeFunctions.length) {
    body += `/**
* Contract write functions
*/\n\n`;

    // process every write function
    await Promise.all(
      writeFunctions.map(async (f) => {
        body += `${generateWriteFunction(f)}\n\n`;
      }),
    );
  }

  const prettified = await prettifyCode(body, {
    parser: "babel-ts",
  });
  return prettified;
}

function generateWriteFunction(f: AbiFunction): string {
  return `${
    f.inputs.length > 0
      ? `/**
 * Represents the parameters for the "${f.name}" function.
 */
export type ${uppercaseFirstLetter(f.name)}Params = {
  ${f.inputs
    .map(
      (x, i) =>
        `${removeLeadingUnderscore(
          x.name || `arg_${i}`,
        )}: AbiParameterToPrimitiveType<${JSON.stringify(x)}>`,
    )
    .join("\n")}
};`
      : ""
  }

/**
 * Calls the "${f.name}" function on the contract.
 * @param options - The options for the "${f.name}" function.
 * @returns A prepared transaction object.
 * @example
 * \`\`\`
 * import { ${f.name} } from "TODO";
 * 
 * const transaction = ${f.name}(${
   f.inputs.length > 0
     ? `{\n * ${f.inputs
         .map(
           (x, i) => ` ${removeLeadingUnderscore(x.name || `arg_${i}`)}: ...,`,
         )
         .join("\n * ")}\n * }`
     : ""
 });
 * 
 * // Send the transaction
 * ...
 * 
 * \`\`\`
 */
export function ${f.name}(
  options: BaseTransactionOptions${
    f.inputs.length > 0 ? `<${uppercaseFirstLetter(f.name)}Params>` : ""
  }
) {
  return prepareContractCall({
    contract: options.contract,
    method: ${JSON.stringify(prepareMethod(f), null, 2)},
    params: [${f.inputs
      .map((x, i) => `options.${removeLeadingUnderscore(x.name || `arg_${i}`)}`)
      .join(", ")}]
  });
};
`;
}

function generateReadFunction(f: AbiFunction): string {
  return `${
    f.inputs.length > 0
      ? `/**
 * Represents the parameters for the "${f.name}" function.
 */
export type ${uppercaseFirstLetter(f.name)}Params = {
  ${f.inputs
    .map(
      (x, i) =>
        `${removeLeadingUnderscore(
          x.name || `arg_${i}`,
        )}: AbiParameterToPrimitiveType<${JSON.stringify(x)}>`,
    )
    .join("\n")}
};`
      : ""
  }

/**
 * Calls the "${f.name}" function on the contract.
 * @param options - The options for the ${f.name} function.
 * @returns The parsed result of the function call.
 * @example
 * \`\`\`
 * import { ${f.name} } from "TODO";
 * 
 * const result = await ${f.name}(${
   f.inputs.length > 0
     ? `{\n * ${f.inputs
         .map(
           (x, i) => ` ${removeLeadingUnderscore(x.name || `arg_${i}`)}: ...,`,
         )
         .join("\n * ")}\n * }`
     : ""
 });
 * 
 * \`\`\`
 */
export async function ${f.name}(
  options: BaseTransactionOptions${
    f.inputs.length > 0 ? `<${uppercaseFirstLetter(f.name)}Params>` : ""
  }
) {
  return readContract({
    contract: options.contract,
    method: ${JSON.stringify(prepareMethod(f), null, 2)},
    params: [${f.inputs
      .map((x, i) => `options.${removeLeadingUnderscore(x.name || `arg_${i}`)}`)
      .join(", ")}]
  });
};
`;
}

function generateEvent(e: AbiEvent): string {
  const indexedInputs = e.inputs.filter((x) => x.indexed);

  return `${
    indexedInputs.length > 0
      ? `/**
 * Represents the filters for the "${e.name}" event.
 */
export type ${uppercaseFirstLetter(e.name)}EventFilters = Partial<{
  ${indexedInputs
    .map((x) => `${x.name}: AbiParameterToPrimitiveType<${JSON.stringify(x)}>`)
    .join("\n")}
}>;`
      : ""
  }

/**
 * Creates an event object for the ${e.name} event.${
   indexedInputs.length > 0
     ? "\n * @param filters - Optional filters to apply to the event."
     : ""
 }
 * @returns The prepared event object.
 * @example
 * \`\`\`
 * import { getContractEvents } from "thirdweb";
 * import { ${eventNameToPreparedEventName(e.name)} } from "TODO";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ${eventNameToPreparedEventName(e.name)}(${
   indexedInputs.length > 0
     ? `{\n * ${indexedInputs
         .map((x) => ` ${x.name}: ...,`)
         .join("\n * ")}\n * }`
     : ""
 })
 * ],
 * });
 * \`\`\`
 */ 
export function ${eventNameToPreparedEventName(e.name)}(${
    indexedInputs.length > 0
      ? `filters: ${uppercaseFirstLetter(e.name)}EventFilters = {}`
      : ""
  }) {
  return prepareEvent({
    signature: "${formatAbiItem(e)}",${
      indexedInputs.length > 0 ? "\n    filters," : ""
    }
  });
};
  `;
}

// helpers

function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function removeLeadingUnderscore(str = "") {
  return str.replace(/^_/, "");
}

function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function eventNameToPreparedEventName(name: string) {
  return `${lowercaseFirstLetter(name)}Event`;
}

const printedPrettierWarning = false;

async function prettifyCode(code: string, options: Options) {
  try {
    const { format } = await import("prettier/standalone.js");
    return await format(code, options);
  } catch (e) {
    if (!printedPrettierWarning) {
      console.info("Prettier not found, skipping code formatting.");
    }
  }

  return code;
}
