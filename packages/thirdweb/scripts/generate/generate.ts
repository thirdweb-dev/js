/* eslint-disable better-tree-shaking/no-top-level-side-effects */
/* eslint-disable jsdoc/require-jsdoc */
import { mkdir, rmdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Abi, AbiFunction, AbiEvent, formatAbiItem } from "abitype";
import { prepareMethod } from "../../src/utils/abi/prepare-method";
import { format } from "prettier";

export async function generateFromAbi(
  abi: Abi,
  outFolder: string,
  extensionName: string,
) {
  const events = abi.filter((x) => x.type === "event") as AbiEvent[];
  const functions = abi.filter((x) => x.type === "function") as AbiFunction[];

  // split functions into read and write
  const readFunctions: AbiFunction[] = [];
  const writeFunctions: AbiFunction[] = [];
  for (const f of functions) {
    if (f.stateMutability === "view" || f.stateMutability === "pure") {
      readFunctions.push(f);
    } else {
      writeFunctions.push(f);
    }
  }

  if (events.length) {
    // make a folder for the events
    await mkdir(join(outFolder, extensionName, "./events"), {
      recursive: true,
    });
    // process every event
    await Promise.all(
      events.map(async (e) => {
        await writeFile(
          join(outFolder, extensionName, "./events", `${e.name}.ts`),
          await format(generateEvent(e, extensionName), {
            parser: "babel-ts",
          }),
          "utf-8",
        );
      }),
    );
  }
  if (readFunctions.length) {
    // make a folder for the read functions
    await mkdir(join(outFolder, extensionName, "./read"), { recursive: true });
    // process every read function
    await Promise.all(
      readFunctions.map(async (f) => {
        await writeFile(
          join(outFolder, extensionName, "./read", `${f.name}.ts`),
          await format(generateReadFunction(f, extensionName), {
            parser: "babel-ts",
          }),
          "utf-8",
        );
      }),
    );
  }
  if (writeFunctions.length) {
    // make a folder for the write functions
    await mkdir(join(outFolder, extensionName, "./write"), { recursive: true });
    // process every write function
    await Promise.all(
      writeFunctions.map(async (f) => {
        await writeFile(
          join(outFolder, extensionName, "./write", `${f.name}.ts`),
          await format(generateWriteFunction(f, extensionName), {
            parser: "babel-ts",
          }),
          "utf-8",
        );
      }),
    );
  }
}

function generateWriteFunction(f: AbiFunction, extensionName: string): string {
  return `import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
${
  f.inputs.length > 0
    ? `import type { AbiParameterToPrimitiveType } from "abitype";`
    : ""
}

${
  f.inputs.length > 0
    ? `/**
 * Represents the parameters for the "${f.name}" function.
 */
export type ${uppercaseFirstLetter(f.name)}Params = {
  ${f.inputs
    .map(
      (x) =>
        `${removeLeadingUnderscore(x.name)}: AbiParameterToPrimitiveType<${JSON.stringify(x)}>`,
    )
    .join("\n")}
};`
    : ""
}

/**
 * Calls the ${f.name} function on the contract.
 * @param options - The options for the ${f.name} function.
 * @returns A prepared transaction object.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`
 * import { ${f.name} } from "thirdweb/extensions/${extensionName}";
 * 
 * const transaction = ${f.name}(${
   f.inputs.length > 0
     ? `{\n * ${f.inputs
         .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
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
      .map((x) => `options.${removeLeadingUnderscore(x.name)}`)
      .join(", ")}]
  });
};
`;
}

function generateReadFunction(f: AbiFunction, extensionName: string): string {
  return `import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
${
  f.inputs.length > 0
    ? `import type { AbiParameterToPrimitiveType } from "abitype";`
    : ""
}

${
  f.inputs.length > 0
    ? `/**
 * Represents the parameters for the "${f.name}" function.
 */
export type ${uppercaseFirstLetter(f.name)}Params = {
  ${f.inputs
    .map(
      (x) =>
        `${removeLeadingUnderscore(
          x.name,
        )}: AbiParameterToPrimitiveType<${JSON.stringify(x)}>`,
    )
    .join("\n")}
};`
    : ""
}

/**
 * Calls the ${f.name} function on the contract.
 * @param options - The options for the ${f.name} function.
 * @returns The parsed result of the function call.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`
 * import { ${f.name} } from "thirdweb/extensions/${extensionName}";
 * 
 * const result = await ${f.name}(${
   f.inputs.length > 0
     ? `{\n * ${f.inputs
         .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
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
      .map((x) => `options.${removeLeadingUnderscore(x.name)}`)
      .join(", ")}]
  });
};
`;
}

function generateEvent(e: AbiEvent, extensionName: string): string {
  const indexedInputs = e.inputs.filter((x) => x.indexed);

  return `import { prepareEvent } from "../../../../event/prepare-event.js";
${
  indexedInputs.length > 0
    ? `import type { AbiParameterToPrimitiveType } from "abitype";`
    : ""
}

${
  indexedInputs.length > 0
    ? `/**
 * Represents the filters for the "${e.name}" event.
 */
export type ${uppercaseFirstLetter(e.name)}Filters = {
  ${indexedInputs
    .map(
      (x) =>
        `${removeLeadingUnderscore(
          x.name,
        )}: AbiParameterToPrimitiveType<${JSON.stringify(x)}>`,
    )
    .join("\n")}
};`
    : ""
}

/**
 * Creates an event object for the ${e.name} event.${indexedInputs.length > 0 ? `\n * @param filters - Optional filters to apply to the event.` : ""}
 * @returns The prepared event object.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`
 * import { getContractEvents } from "thirdweb";
 * import { ${eventNameToPreparedEventName(e.name)} } from "thirdweb/extensions/${extensionName}";
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ${eventNameToPreparedEventName(e.name)}(${
   indexedInputs.length > 0
     ? `{\n * ${indexedInputs
         .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
         .join("\n * ")}\n * }`
     : ""
 })
 * ],
 * });
 * \`\`\`
 */ 
export function ${eventNameToPreparedEventName(e.name)}(${indexedInputs.length > 0 ? `filters: ${uppercaseFirstLetter(e.name)}Filters = {}` : ""}) {
  return prepareEvent({
    signature: "${formatAbiItem(e)}",${indexedInputs.length > 0 ? `\n    filters,` : ""}
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

const ABI_FOLDER = join(import.meta.dirname, "./abis");
const OUT_FOLDER = join(
  import.meta.dirname,
  "../../src/extensions/__generated__",
);

async function main() {
  await rmdir(OUT_FOLDER, { recursive: true });
  await mkdir(OUT_FOLDER, { recursive: true });

  const files = await readdir(ABI_FOLDER);
  for (const file of files) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const extensionName = file.replace(".json", "");
    const abi = JSON.parse(await readFile(join(ABI_FOLDER, file), "utf-8"));
    await generateFromAbi(abi, OUT_FOLDER, extensionName);
  }
}

main();
