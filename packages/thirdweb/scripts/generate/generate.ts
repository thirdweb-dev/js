import { mkdir, readFile, readdir, rmdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type Abi,
  type AbiEvent,
  type AbiFunction,
  formatAbiItem,
  parseAbiItem,
} from "abitype";
import { format } from "prettier";
import { prepareMethod } from "../../src/utils/abi/prepare-method";

export async function generateFromAbi(
  abi: Abi | string[],
  outFolder: string,
  extensionFileName: string,
  extensionName: string,
) {
  // turn any human readable abi into a proper abi object
  // biome-ignore lint/style/noParameterAssign: is ok
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

  if (events.length) {
    // make a folder for the events
    await mkdir(join(outFolder, extensionFileName, "./events"), {
      recursive: true,
    });
    // process every event
    await Promise.all(
      events.map(async (e) => {
        await writeFile(
          join(outFolder, extensionFileName, "./events", `${e.name}.ts`),
          await format(generateEvent(e, extensionName), {
            parser: "babel-ts",
            trailingComma: "all",
          }),
          "utf-8",
        );
      }),
    );
  }
  if (readFunctions.length) {
    // make a folder for the read functions
    await mkdir(join(outFolder, extensionFileName, "./read"), {
      recursive: true,
    });
    // process every read function
    await Promise.all(
      readFunctions.map(async (f) => {
        await writeFile(
          join(outFolder, extensionFileName, "./read", `${f.name}.ts`),
          await format(generateReadFunction(f, extensionName), {
            parser: "babel-ts",
            trailingComma: "all",
          }),
          "utf-8",
        );
      }),
    );
  }
  if (writeFunctions.length) {
    // make a folder for the write functions
    await mkdir(join(outFolder, extensionFileName, "./write"), {
      recursive: true,
    });
    // process every write function
    await Promise.all(
      writeFunctions.map(async (f) => {
        await writeFile(
          join(outFolder, extensionFileName, "./write", `${f.name}.ts`),
          await format(generateWriteFunction(f, extensionName), {
            parser: "babel-ts",
            trailingComma: "all",
          }),
          "utf-8",
        );
      }),
    );
  }
}

function generateWriteFunction(f: AbiFunction, extensionName: string): string {
  const preparedMethod = prepareMethod(f);
  const needsAbiParamToPrimitiveType = f.inputs.length > 0;
  const inputTypeName = `${uppercaseFirstLetter(f.name)}Params`;

  return `${
    needsAbiParamToPrimitiveType
      ? `import type { AbiParameterToPrimitiveType } from "abitype";\n`
      : ""
  }import type { BaseTransactionOptions${
    f.inputs.length ? ", WithOverrides" : ""
  } } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
${
  f.inputs.length > 0
    ? `import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";`
    : ""
}
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";


${
  f.inputs.length > 0
    ? `/**
 * Represents the parameters for the "${f.name}" function.
 */
export type ${inputTypeName} = WithOverrides<{
  ${f.inputs
    .map(
      (x) =>
        `${removeLeadingUnderscore(
          x.name,
        )}: AbiParameterToPrimitiveType<${JSON.stringify(x)}>`,
    )
    .join("\n")}}>

    `
    : ""
};

export const FN_SELECTOR = "${preparedMethod[0]}" as const;
const FN_INPUTS = ${JSON.stringify(preparedMethod[1], null, 2)} as const;
const FN_OUTPUTS = ${JSON.stringify(preparedMethod[2], null, 2)} as const;

/**
 * Checks if the \`${f.name}\` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the \`${f.name}\` method is supported.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { is${uppercaseFirstLetter(
   f.name,
 )}Supported } from "thirdweb/extensions/${extensionName}";
 * 
 * const supported = await is${uppercaseFirstLetter(f.name)}Supported(contract);
 * \`\`\`
 */
export async function is${uppercaseFirstLetter(f.name)}Supported(contract: ThirdwebContract<any>) {
  return detectMethod({contract, method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const});
}

${
  f.inputs.length > 0
    ? `/**
 * Encodes the parameters for the "${f.name}" function.
 * @param options - The options for the ${f.name} function.
 * @returns The encoded ABI parameters.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { encode${uppercaseFirstLetter(
   f.name,
 )}Params } "thirdweb/extensions/${extensionName}";
 * const result = encode${uppercaseFirstLetter(f.name)}Params({\n * ${f.inputs
   .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
   .join("\n * ")}\n * });
 * \`\`\`
 */
export function encode${uppercaseFirstLetter(
        f.name,
      )}Params(options: ${inputTypeName}) {
  return encodeAbiParameters(FN_INPUTS, [${f.inputs
    .map((x) => `options.${removeLeadingUnderscore(x.name)}`)
    .join(", ")}]);
}
`
    : ""
}
${
  f.inputs.length > 0
    ? `/**
 * Encodes the "${f.name}" function into a Hex string with its parameters.
 * @param options - The options for the ${f.name} function.
 * @returns The encoded hexadecimal string.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { encode${uppercaseFirstLetter(
   f.name,
 )} } "thirdweb/extensions/${extensionName}";
 * const result = encode${uppercaseFirstLetter(f.name)}({\n * ${f.inputs
   .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
   .join("\n * ")}\n * });
 * \`\`\`
 */
export function encode${uppercaseFirstLetter(f.name)}(options: ${inputTypeName}) {
  \/\/ we do a "manual" concat here to avoid the overhead of the "concatHex" function
  \/\/ we can do this because we know the specific formats of the values
  return FN_SELECTOR + encode${uppercaseFirstLetter(f.name)}Params(options).slice(2) as \`\${typeof FN_SELECTOR}\${string}\`;
}
`
    : ""
}
/**
 * Prepares a transaction to call the "${f.name}" function on the contract.
 * @param options - The options for the "${f.name}" function.
 * @returns A prepared transaction object.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { ${f.name} } from "thirdweb/extensions/${extensionName}";
 * 
 * const transaction = ${f.name}(${
   f.inputs.length > 0
     ? `{\n *  contract,\n * ${f.inputs
         .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
         .join("\n * ")}\n*  overrides: {\n*    ...\n*  }\n * }`
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
    f.inputs.length > 0
      ? `<${inputTypeName} | {
      asyncParams: () => Promise<${inputTypeName}>
    }>`
      : ""
  }
) {

  ${
    f.inputs.length
      ? `const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  })`
      : ""
  };

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    ${
      f.inputs.length
        ? `params: async () => {
        const resolvedOptions = await asyncOptions();
        return [${f.inputs
          .map((x) => `resolvedOptions.${removeLeadingUnderscore(x.name)}`)
          .join(", ")}] as const;
      },
      value: async () => (await asyncOptions()).overrides?.value,
      accessList: async () => (await asyncOptions()).overrides?.accessList,
      gas: async () => (await asyncOptions()).overrides?.gas,
      gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
      maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
      maxPriorityFeePerGas: async () => (await asyncOptions()).overrides?.maxPriorityFeePerGas,
      nonce: async () => (await asyncOptions()).overrides?.nonce,
      extraGas: async () => (await asyncOptions()).overrides?.extraGas,
      erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
      `
        : ""
    }
  });
};
`;
}

function generateReadFunction(f: AbiFunction, extensionName: string): string {
  const preparedMethod = prepareMethod(f);
  const needsAbiParamToPrimitiveType = f.inputs.length > 0;
  return `${
    needsAbiParamToPrimitiveType
      ? `import type { AbiParameterToPrimitiveType } from "abitype";\n`
      : ""
  }import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
${
  f.inputs.length > 0
    ? `import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";`
    : ""
}
${
  f.outputs.length > 0
    ? `import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";`
    : ""
}
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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

export const FN_SELECTOR = "${preparedMethod[0]}" as const;
const FN_INPUTS = ${JSON.stringify(preparedMethod[1], null, 2)} as const;
const FN_OUTPUTS = ${JSON.stringify(preparedMethod[2], null, 2)} as const;

/**
 * Checks if the \`${f.name}\` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the \`${f.name}\` method is supported.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { is${uppercaseFirstLetter(
   f.name,
 )}Supported } from "thirdweb/extensions/${extensionName}";
 * 
 * const supported = await is${uppercaseFirstLetter(f.name)}Supported(contract);
 * \`\`\`
 */
export async function is${uppercaseFirstLetter(f.name)}Supported(contract: ThirdwebContract<any>) {
  return detectMethod({contract, method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const});
}

${
  f.inputs.length > 0
    ? `/**
 * Encodes the parameters for the "${f.name}" function.
 * @param options - The options for the ${f.name} function.
 * @returns The encoded ABI parameters.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { encode${uppercaseFirstLetter(
   f.name,
 )}Params } "thirdweb/extensions/${extensionName}";
 * const result = encode${uppercaseFirstLetter(f.name)}Params({\n * ${f.inputs
   .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
   .join("\n * ")}\n * });
 * \`\`\`
 */
export function encode${uppercaseFirstLetter(
        f.name,
      )}Params(options: ${uppercaseFirstLetter(f.name)}Params) {
  return encodeAbiParameters(FN_INPUTS, [${f.inputs
    .map((x) => `options.${removeLeadingUnderscore(x.name)}`)
    .join(", ")}]);
}
`
    : ""
}
${
  f.inputs.length > 0
    ? `/**
 * Encodes the "${f.name}" function into a Hex string with its parameters.
 * @param options - The options for the ${f.name} function.
 * @returns The encoded hexadecimal string.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { encode${uppercaseFirstLetter(
   f.name,
 )} } "thirdweb/extensions/${extensionName}";
 * const result = encode${uppercaseFirstLetter(f.name)}({\n * ${f.inputs
   .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
   .join("\n * ")}\n * });
 * \`\`\`
 */
export function encode${uppercaseFirstLetter(
        f.name,
      )}(options: ${uppercaseFirstLetter(f.name)}Params) {
  \/\/ we do a "manual" concat here to avoid the overhead of the "concatHex" function
  \/\/ we can do this because we know the specific formats of the values
  return FN_SELECTOR + encode${uppercaseFirstLetter(f.name)}Params(options).slice(2) as \`\${typeof FN_SELECTOR}\${string}\`;
}
`
    : ""
}
${
  f.outputs.length > 0
    ? `/**
  * Decodes the result of the ${f.name} function call.
  * @param result - The hexadecimal result to decode.
  * @returns The decoded result as per the FN_OUTPUTS definition.
  * @extension ${extensionName.toUpperCase()}
  * @example
  * \`\`\`ts
  * import { decode${uppercaseFirstLetter(
    f.name,
  )}Result } from "thirdweb/extensions/${extensionName}";
  * const result = decode${uppercaseFirstLetter(f.name)}Result("...");
  * \`\`\`
  */
export function decode${uppercaseFirstLetter(f.name)}Result(result: Hex) {
  ${
    preparedMethod[2].length > 1
      ? "return decodeAbiParameters(FN_OUTPUTS, result)"
      : "return decodeAbiParameters(FN_OUTPUTS, result)[0]"
  };
}
`
    : ""
}


/**
 * Calls the "${f.name}" function on the contract.
 * @param options - The options for the ${f.name} function.
 * @returns The parsed result of the function call.
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { ${f.name} } from "thirdweb/extensions/${extensionName}";
 * 
 * const result = await ${f.name}({
 *  contract, ${
   f.inputs.length > 0
     ? `\n * ${f.inputs
         .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
         .join("\n * ")}\n`
     : "\n"
 } * });
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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [${f.inputs
      .map((x) => `options.${removeLeadingUnderscore(x.name)}`)
      .join(", ")}]
  });
};
`;
}

function generateEvent(e: AbiEvent, extensionName: string): string {
  const indexedInputs = e.inputs.filter((x) => x.indexed);

  return `import { prepareEvent } from "../../../../../event/prepare-event.js";
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
 * @extension ${extensionName.toUpperCase()}
 * @example
 * \`\`\`ts
 * import { getContractEvents } from "thirdweb";
 * import { ${eventNameToPreparedEventName(
   e.name,
 )} } from "thirdweb/extensions/${extensionName}";
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

//custom script (will not be part of CLI)

const ABI_FOLDER = join(__dirname, "./abis");
const EXTENSIONS_FOLDER = join(__dirname, "../../src/extensions");

async function main() {
  const filesAndFolders = await readdir(ABI_FOLDER);
  const folders = filesAndFolders.filter((x) => !x.includes("."));
  // for each folder in the abi folder find all files
  for (const folder of folders) {
    const OUT_PATH = join(EXTENSIONS_FOLDER, folder, "__generated__");
    // delete the "__generated__" folder inside the extension folder
    await rmdir(OUT_PATH, { recursive: true });

    // create the "__generated__" folder inside the extension folder
    await mkdir(OUT_PATH, { recursive: true });
    const files = await readdir(join(ABI_FOLDER, folder));
    for (const file of files) {
      if (!file.endsWith(".json")) {
        continue;
      }
      const extensionName = file.replace(".json", "");
      const abi = JSON.parse(
        await readFile(join(ABI_FOLDER, folder, file), "utf-8"),
      );
      await generateFromAbi(abi, OUT_PATH, extensionName, folder);
    }
  }
}

main();
