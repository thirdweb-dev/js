import { Abi } from "../../schema/contracts/custom";
import { utils } from "ethers";
import { Plugin } from "../../types/plugins";
import { ExtensionFunction } from "../../types/extensions";

function getFunctionSignature(fnInputs: any): string {
  return (
    "(" +
    fnInputs
      .map((i: any) => {
        return i.type === "tuple"
          ? getFunctionSignature(i.components)
          : i.type === "tuple[]"
          ? getFunctionSignature(i.components) + `[]`
          : i.type;
      })
      .join(",") +
    ")"
  );
}

export function generatePluginFunctions(
  pluginAddress: string,
  pluginAbi: Abi,
): Plugin[] {
  const pluginInterface = new utils.Interface(pluginAbi);
  const pluginFunctions: Plugin[] = [];
  // TODO - filter out common functions like _msgSender(), contractType(), etc.
  for (const fnFragment of Object.values(pluginInterface.functions)) {
    const fn = pluginInterface.getFunction(
      pluginInterface.getSighash(fnFragment),
    );
    if (fn.name.includes("_")) {
      continue;
    }
    pluginFunctions.push({
      functionSelector: pluginInterface.getSighash(fn),
      functionSignature: fn.name + getFunctionSignature(fn.inputs),
      pluginAddress: pluginAddress,
    });
  }
  return pluginFunctions;
}

export function generateExtensionFunctions(
  extensionAbi: any,
): ExtensionFunction[] {
  const extensionInterface = new utils.Interface(extensionAbi);
  const extensionFunctions: ExtensionFunction[] = [];
  // TODO - filter out common functions like _msgSender(), contractType(), etc.

  for (const fnFragment of Object.values(extensionInterface.functions)) {
    const fn = extensionInterface.getFunction(
      extensionInterface.getSighash(fnFragment),
    );
    if (fn.name.startsWith("_")) {
      continue;
    }
    extensionFunctions.push({
      functionSelector: extensionInterface.getSighash(fn),
      functionSignature: fn.name + getFunctionSignature(fn.inputs),
    });
  }
  return extensionFunctions;
}
