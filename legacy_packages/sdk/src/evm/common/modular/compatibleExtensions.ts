import { providers, utils } from "ethers";
import {
  coreContractAbi,
  extensionContractAbi,
} from "../../constants/thirdweb-features";
import { hasDuplicates } from "../utils";
import { getChainByChainIdAsync, getChainRPC } from "@thirdweb-dev/chains";

export async function compatibleExtensions(
  coreBytecode: string,
  extensionBytecodes: string[],
  chainId: number,
): Promise<boolean> {
  const chain = await getChainByChainIdAsync(chainId);
  const rpcUrl = getChainRPC(chain);
  const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl);
  const addr = "0x0000000000000000000000000000000000000124";

  const coreIface = new utils.Interface(coreContractAbi);
  const coreCalldata = coreIface.encodeFunctionData(
    "getSupportedCallbackFunctions",
    [],
  );
  if (!coreBytecode.startsWith("0x6080604052")) {
    const index = coreBytecode.indexOf("6080604052");
    coreBytecode = `0x${coreBytecode.substring(index)}`;
  } else if(coreBytecode.lastIndexOf("6080604052") > 0) {
    const index = coreBytecode.lastIndexOf("6080604052");
    coreBytecode = `0x${coreBytecode.substring(index)}`;
  }
  const core = await jsonRpcProvider.send("eth_call", [
    { to: addr, data: coreCalldata },
    "latest",
    { [addr]: { code: coreBytecode } },
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
      } else if(b.lastIndexOf("6080604052") > 0) {
        const index = b.lastIndexOf("6080604052");
        b = `0x${b.substring(index)}`;
      }

      return jsonRpcProvider.send("eth_call", [
        { to: addr, data: extensionCalldata },
        "latest",
        { [addr]: { code: b } },
      ]);
    }),
  );

  const decodedCore = coreIface.decodeFunctionResult(
    "getSupportedCallbackFunctions",
    core,
  );
  const coreCallbackSelectors = decodedCore.map((c: any) => c.selector);

  const selectors = extensions.map((e: any) => {
    const decodedExtensionConfig = extensionIface.decodeFunctionResult(
      "getExtensionConfig",
      e,
    );
    const extensionFallbackSelectors =
      decodedExtensionConfig[0].fallbackFunctions.map((a: any) => a.selector);
    const extensionCallbackSelectors =
      decodedExtensionConfig[0].callbackFunctions.map((a: any) => a.selector);

    return [
      ...extensionFallbackSelectors,
      ...extensionCallbackSelectors,
    ];
  });

  selectors.push([coreCallbackSelectors]);

  return !hasDuplicates(
    selectors.flat(),
    (a: string, b: string): boolean => a === b,
  );
}
