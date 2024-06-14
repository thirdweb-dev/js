import { providers, utils } from "ethers";
import {
  coreContractAbi,
  extensionContractAbi,
} from "../../constants/thirdweb-features";
import { hasDuplicates } from "../utils";
import { getChainByChainIdAsync, getChainRPC } from "@thirdweb-dev/chains";

type CallbackFunction = {
  selector: string;
};

type FallbackFunction = {
  selector: string;
  permissionBits: string;
};

type SupportedCallbackFunction = {
  selector: string;
  mode: number;
};

export async function compatibleExtensions(
  coreBytecode: string,
  extensionBytecodes: string[],
  chainId: number,
): Promise<boolean> {
  const chain = await getChainByChainIdAsync(chainId);
  const rpcUrl = getChainRPC(chain);
  const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl);
  const addr = "0x0000000000000000000000000000000000000124"; // arbitrary address

  /**
   *  Here we use state override with eth_call.
   *
   *  This lets us call functions on a non-deployed contract, by using its deployed bytecode
   *  to override code of an arbitrary address in eth_call.
   *
   *  Encode function calldata, and perform eth_call with bytecode override.
   */

  const coreIface = new utils.Interface(coreContractAbi);
  const coreCalldata = coreIface.encodeFunctionData(
    "getSupportedCallbackFunctions",
    [],
  );
  if (!coreBytecode.startsWith("0x6080604052")) {
    const index = coreBytecode.indexOf("6080604052");
    coreBytecode = `0x${coreBytecode.substring(index)}`;
  } else if (coreBytecode.lastIndexOf("6080604052") > 0) {
    const index = coreBytecode.lastIndexOf("6080604052");
    coreBytecode = `0x${coreBytecode.substring(index)}`;
  }
  const core = await jsonRpcProvider.send("eth_call", [
    { to: addr, data: coreCalldata },
    "latest",
    { [addr]: { code: coreBytecode } }, // eth_call with bytecode override
  ]);

  const extensionIface = new utils.Interface(extensionContractAbi);
  const extensionCalldata = extensionIface.encodeFunctionData(
    "getExtensionConfig",
    [],
  );
  const extensions = await Promise.all(
    extensionBytecodes.map((b: string) => {
      // TODO: Upload deployed bytecode on publish metadata

      if (!b.startsWith("0x6080604052")) {
        const index = b.indexOf("6080604052");
        b = `0x${b.substring(index)}`;
      } else if (b.lastIndexOf("6080604052") > 0) {
        const index = b.lastIndexOf("6080604052");
        b = `0x${b.substring(index)}`;
      }

      return jsonRpcProvider.send("eth_call", [
        { to: addr, data: extensionCalldata },
        "latest",
        { [addr]: { code: b } }, // eth_call with bytecode override
      ]);
    }),
  );

  const decodedCore = coreIface.decodeFunctionResult(
    "getSupportedCallbackFunctions",
    core,
  );
  const coreCallbackSelectors = decodedCore.flat().map(
    (c: SupportedCallbackFunction) => c.selector,
  );

  // extract callback/fallback selectors and required interfaces from extension config
  const requiredInterfaces: string[] = [];
  const extensionFallbackSelectors: string[] = [];
  const extensionCallbackSelectors: string[] = [];
  const selectors: string[] = [];

  extensions.forEach((e: string) => {
    const decodedExtensionConfig = extensionIface.decodeFunctionResult(
      "getExtensionConfig",
      e,
    );

    requiredInterfaces.push(...decodedExtensionConfig[0].requiredInterfaces);
    const fallbackSelectors =
      decodedExtensionConfig[0].fallbackFunctions.map(
        (a: FallbackFunction) => a.selector,
      );
    const callbackSelectors =
      decodedExtensionConfig[0].callbackFunctions.map(
        (a: CallbackFunction) => a.selector,
      );

      extensionFallbackSelectors.push(...fallbackSelectors);
      extensionCallbackSelectors.push(...callbackSelectors);
  });
  
  // check if callback selectors are supported
  for(const callback of extensionCallbackSelectors) {
    if(!coreCallbackSelectors.includes(callback)) {
      return false;
    }
  }

  // check if the core contract supports required interfaces by extensions above
  if(requiredInterfaces.length > 0) {
    const supportsInterfaceResult = await Promise.all(
      requiredInterfaces.map((r) => {
        const supportsInterfaceCalldata = coreIface.encodeFunctionData(
          "supportsInterface",
          [r],
        );
        return jsonRpcProvider.send("eth_call", [
          { to: addr, data: supportsInterfaceCalldata },
          "latest",
          { [addr]: { code: coreBytecode } },
        ]);
      }),
    );
    const supportsInterfaceDecoded = supportsInterfaceResult.map(r => {
      return coreIface.decodeFunctionResult(
        "supportsInterface",
        r,
      );
    })
    if (supportsInterfaceDecoded.flat().some((element) => element === false)) {
      return false;
    }
  }

  // check duplicate callback/fallback signatures
  selectors.push(...extensionFallbackSelectors, ...extensionCallbackSelectors);
  return !hasDuplicates(
    selectors.flat(),
    (a: string, b: string): boolean => a === b,
  );
}
