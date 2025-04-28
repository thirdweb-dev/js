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
  const encodeFunctions: AbiFunction[] = [];
  const writeFunctions: AbiFunction[] = [];
  const installFunctions: AbiFunction[] = [];
  for (const f of functions) {
    if (f.stateMutability === "view" || f.stateMutability === "pure") {
      if (overloadedReads.has(f.name)) {
        continue;
      }
      if (f.name.startsWith("encodeBytesOnInstall")) {
        // installable modules all need a encodeBytesOnInstall function in the abi file
        installFunctions.push(f);
      }
      if (f.name.startsWith("encode") && f.inputs.length > 0) {
        encodeFunctions.push(f);
      } else {
        readFunctions.push(f);
      }
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
          await format(generateEvent(e, extensionName, extensionFileName), {
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
          await format(
            generateReadFunction(f, extensionName, extensionFileName),
            {
              parser: "babel-ts",
              trailingComma: "all",
            },
          ),
          "utf-8",
        );
      }),
    );
  }
  if (encodeFunctions.length) {
    // make a folder for the read functions
    await mkdir(join(outFolder, extensionFileName, "./encode"), {
      recursive: true,
    });
    // process every read function
    await Promise.all(
      encodeFunctions.map(async (f) => {
        await writeFile(
          join(outFolder, extensionFileName, "./encode", `${f.name}.ts`),
          await format(generateEncodeFunction(f, extensionName), {
            parser: "babel-ts",
            trailingComma: "all",
          }),
          "utf-8",
        );
      }),
    );
  }
  if (installFunctions.length) {
    // make a folder for the read functions
    await mkdir(join(outFolder, extensionFileName, "./module"), {
      recursive: true,
    });
    // process every read function
    await Promise.all(
      installFunctions.map(async (f) => {
        await writeFile(
          join(outFolder, extensionFileName, "./module/install.ts"),
          await format(generateInstallFunction(extensionFileName, f), {
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
          await format(
            generateWriteFunction(f, extensionName, extensionFileName),
            {
              parser: "babel-ts",
              trailingComma: "all",
            },
          ),
          "utf-8",
        );
      }),
    );
  }
}

function generateWriteFunction(
  f: AbiFunction,
  extensionName: string,
  extensionFileName: string,
): string {
  const preparedMethod = prepareMethod(f);
  const needsAbiParamToPrimitiveType = f.inputs.length > 0;
  const inputTypeName = `${uppercaseFirstLetter(f.name)}Params`;
  const info = getFunctionOrModuleInfo(
    f.name,
    extensionName,
    extensionFileName,
  );

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
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the \`${f.name}\` method is supported.
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * ${info.getImportPath("supported")}
 * 
 * const supported = ${info.getFnName("supported")}(["0x..."]);
 * \`\`\`
 */
export function is${uppercaseFirstLetter(f.name)}Supported(availableSelectors: string[]) {
  return detectMethod({availableSelectors, method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const});
}

${
  f.inputs.length > 0
    ? `/**
 * Encodes the parameters for the "${f.name}" function.
 * @param options - The options for the ${f.name} function.
 * @returns The encoded ABI parameters.
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * ${info.getImportPath("encodeParams")}
 * const result = ${info.getFnName("encodeParams")}({\n * ${f.inputs
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
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * ${info.getImportPath("encode")}
 * const result = ${info.getFnName("encode")}({\n * ${f.inputs
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
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * import { sendTransaction } from "thirdweb";
 * ${info.getImportPath("function")}
 * 
 * const transaction = ${info.getFnName("function")}(${
   f.inputs.length > 0
     ? `{\n *  contract,\n * ${f.inputs
         .map((x) => ` ${removeLeadingUnderscore(x.name)}: ...,`)
         .join("\n * ")}\n*  overrides: {\n*    ...\n*  }\n * }`
     : ""
 });
 * 
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
      authorizationList: async () => (await asyncOptions()).overrides?.authorizationList,
      `
        : ""
    }
  });
};
`;
}

function getFunctionOrModuleInfo(
  abiName: string,
  extensionName: string,
  extensionFileName: string,
) {
  // TODO: should make every extension an exported named object: ERC20.balanceOf, etc.
  const isModule =
    extensionName === "modules" &&
    extensionFileName !== "IModularCore" &&
    extensionFileName !== "IModule" &&
    extensionFileName !== "OwnableRoles";
  const moduleName = extensionFileName;

  function getFnName(
    type:
      | "function"
      | "encode"
      | "decode"
      | "encodeParams"
      | "supported"
      | "event",
  ) {
    const detectName = `is${uppercaseFirstLetter(abiName)}Supported`;
    const encodeName = `encode${uppercaseFirstLetter(abiName)}`;
    const encodeParamsName = `encode${uppercaseFirstLetter(abiName)}Params`;
    const decodeName = `decode${uppercaseFirstLetter(abiName)}Result`;
    switch (type) {
      case "function":
        return isModule ? `${moduleName}.${abiName}` : abiName;
      case "encode":
        return isModule ? `${moduleName}.${encodeName}` : encodeName;
      case "decode":
        return isModule ? `${moduleName}.${decodeName}` : decodeName;
      case "encodeParams":
        return isModule
          ? `${moduleName}.${encodeParamsName}`
          : encodeParamsName;
      case "supported":
        return isModule ? `${moduleName}.${detectName}` : detectName;
      case "event":
        return isModule
          ? `${moduleName}.${eventNameToPreparedEventName(abiName)}`
          : eventNameToPreparedEventName(abiName);
    }
  }
  function getImportPath(
    type:
      | "function"
      | "encode"
      | "decode"
      | "encodeParams"
      | "supported"
      | "event",
  ) {
    const importPath = isModule
      ? `import { ${moduleName} } from "thirdweb/modules";`
      : `import { ${getFnName(type)} } from "thirdweb/extensions/${extensionName}";`;
    return importPath;
  }
  function getTsDocTag() {
    return isModule
      ? `@modules ${moduleName}`
      : `@extension ${extensionName.toUpperCase()}`;
  }
  return {
    getFnName,
    getImportPath,
    getTsDocTag,
  };
}

function generateReadFunction(
  f: AbiFunction,
  extensionName: string,
  extensionFileName: string,
): string {
  const preparedMethod = prepareMethod(f);
  const needsAbiParamToPrimitiveType = f.inputs.length > 0;
  const info = getFunctionOrModuleInfo(
    f.name,
    extensionName,
    extensionFileName,
  );
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
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the \`${f.name}\` method is supported.
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * ${info.getImportPath("supported")}
 * const supported = ${info.getFnName("supported")}(["0x..."]);
 * \`\`\`
 */
export function is${uppercaseFirstLetter(f.name)}Supported(availableSelectors: string[]) {
  return detectMethod({availableSelectors, method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const});
}

${
  f.inputs.length > 0
    ? `/**
 * Encodes the parameters for the "${f.name}" function.
 * @param options - The options for the ${f.name} function.
 * @returns The encoded ABI parameters.
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * ${info.getImportPath("encodeParams")}
 * const result = ${info.getFnName("encodeParams")}({\n * ${f.inputs
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
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * ${info.getImportPath("encode")}
 * const result = ${info.getFnName("encode")}({\n * ${f.inputs
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
  * ${info.getTsDocTag()}
  * @example
  * \`\`\`ts
  * ${info.getImportPath("decode")}
  * const result = ${info.getFnName("decode")}Result("...");
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
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * ${info.getImportPath("function")}
 * 
 * const result = await ${info.getFnName("function")}({
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

function generateInstallFunction(moduleName: string, f: AbiFunction): string {
  const needsParams =
    f.name.startsWith("encodeBytesOnInstall") && f.inputs.length > 0;
  return `
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import type { PreparedTransaction } from "../../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../../utils/address.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
${
  needsParams
    ? `import {
  type EncodeBytesOnInstallParams,
  encodeBytesOnInstallParams,
} from "../encode/encodeBytesOnInstall.js";`
    : ""
}
import { getOrDeployModule } from "../../../common/getOrDeployModule.js";
import { installPublishedModule } from "../../../common/installPublishedModule.js";

const contractId = "${moduleName}";

/**
 * Convenience function to add the ${moduleName} module as a default module on a core contract.
 * @param params - The parameters for the module.
 * @returns - The module function.
 * @example
 * \`\`\`ts
 * import { ${moduleName}, deployModularContract } from "thirdweb/modules";
 *
 * const deployed = deployModularContract({
 *   client,
 *   chain,
 *   account,
 *   core: "${moduleName.slice(moduleName.indexOf("ERC"))}",
 *   params: {
 *     name: "My Modular Contract",
 *   },
 *   modules: [
 *     ${moduleName}.module(${
   needsParams
     ? `{\n * ${f.inputs
         .map((x) => `       ${removeLeadingUnderscore(x.name)}: ...,`)
         .join("\n * ")}\n *     })`
     : ")"
 },
 *   ],
 * });
 * \`\`\`
 * @modules ${moduleName}
 */
export function module(${needsParams ? "params: EncodeBytesOnInstallParams & { publisher?: string }" : "params?: { publisher?: string }"}) {
  return async (args: {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
  }) => {
    // deploys if needed
    const moduleContract = await getOrDeployModule({
      account: args.account,
      chain: args.chain,
      client: args.client,
      contractId,
      publisher: params?.publisher,
    });
    return {
      module: moduleContract.address as Address,
      data: ${needsParams ? "encodeInstall(params)" : `"0x" as const`},
    };
  };
}
  
/**
 * Installs the ${moduleName} module on a core contract.
 * @param options
 * @returns the transaction to install the module
 * @example
 * \`\`\`ts
 * import { ${moduleName} } from "thirdweb/modules";
 *
 * const transaction  = ${moduleName}.install({
 *  contract: coreContract,
 *  account: account,
 ${
   needsParams
     ? `*  params: {\n * ${f.inputs
         .map((x) => `    ${removeLeadingUnderscore(x.name)}: ...,`)
         .join("\n * ")}\n *  },`
     : ""
 }
 * });
 *
 * await sendTransaction({
 *  transaction,
 *  account,
 * });
 * \`\`\`
 * @modules ${moduleName}
 */
export function install(options: {
  contract: ThirdwebContract;
  account: Account;
  ${needsParams ? "params: EncodeBytesOnInstallParams & { publisher?: string };" : "params?: { publisher?: string }"}
}): PreparedTransaction {
  return installPublishedModule({
    account: options.account,
    contract: options.contract,
    moduleName: contractId,
    moduleData: ${needsParams ? "encodeInstall(options.params)" : `"0x" as const`},
    publisher: options.params?.publisher,
  });
}

/**
 * Encodes the install data for the ${moduleName} module.
 * @param params - The parameters for the module.
 * @returns - The encoded data.
 * @modules ${moduleName}
 */
export function encodeInstall(${needsParams ? "params: EncodeBytesOnInstallParams" : ""}) {
  return ${needsParams ? "encodeBytesOnInstallParams(params)" : `"0x"`};
}
`;
}

function generateEncodeFunction(f: AbiFunction, extensionName: string): string {
  const preparedMethod = prepareMethod(f);
  const needsAbiParamToPrimitiveType = f.inputs.length > 0;
  return `${
    needsAbiParamToPrimitiveType
      ? `import type { AbiParameterToPrimitiveType } from "abitype";\n`
      : ""
  }
${
  f.inputs.length > 0
    ? `import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";`
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

export const FN_SELECTOR = "${preparedMethod[0]}" as const;
const FN_INPUTS = ${JSON.stringify(preparedMethod[1], null, 2)} as const;

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
export function ${f.name}Params(options: ${uppercaseFirstLetter(f.name)}Params) {
  return encodeAbiParameters(FN_INPUTS, [${f.inputs
    .map((x) => `options.${removeLeadingUnderscore(x.name)}`)
    .join(", ")}]);
}
`
    : ""
}`;
}

function generateEvent(
  e: AbiEvent,
  extensionName: string,
  extensionFileName: string,
): string {
  const indexedInputs = e.inputs.filter((x) => x.indexed);
  const info = getFunctionOrModuleInfo(
    e.name,
    extensionName,
    extensionFileName,
  );

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
 * ${info.getTsDocTag()}
 * @example
 * \`\`\`ts
 * import { getContractEvents } from "thirdweb";
 * ${info.getImportPath("event")}
 * 
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ${info.getFnName("event")}(${
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
    await rmdir(OUT_PATH, { recursive: true }).catch(() => {});

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

      const humanizedAbi = abi.map((elem: Abi[number] | string) =>
        typeof elem === "string" ? elem : formatAbiItem(elem),
      );
      // if any element of the abi is NOT a string, convert it to humanreadable (might as well) -> write it back to the file
      await writeFile(
        join(ABI_FOLDER, folder, file),
        JSON.stringify(humanizedAbi, null, 2),
        "utf-8",
      );
      // then generate the files from the abi
      await generateFromAbi(humanizedAbi, OUT_PATH, extensionName, folder);
    }
  }
}

main();
