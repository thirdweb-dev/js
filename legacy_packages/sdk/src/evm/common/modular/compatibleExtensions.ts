import { providers, utils } from "ethers";
import { extensionContractAbi } from "../../constants/thirdweb-features";
import { hasDuplicates } from "../utils";
import { getChainByChainIdAsync, getChainRPC } from "@thirdweb-dev/chains";

export async function compatibleExtensions(
  bytecodes: string[],
  chainId: number,
): Promise<boolean> {
  const chain = await getChainByChainIdAsync(chainId);
  const rpcUrl = getChainRPC(chain);
  const iface = new utils.Interface(extensionContractAbi);
  const calldata = iface.encodeFunctionData("getExtensionConfig", []);

  const configs = await Promise.all(
    bytecodes.map((b: string) => {
        // TODO: Upload deployed bytecode on publish metadata
        
      if (!b.startsWith("0x6080604052")) {
        const index = b.indexOf("6080604052");
        b = `0x${b.substring(index)}`;
      }
      const addr = "0x0000000000000000000000000000000000000124";
      const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl);
      return jsonRpcProvider.send("eth_call", [
        { to: addr, data: calldata },
        "latest",
        { [addr]: { code: b } },
      ]);
    }),
  );

  const selectors = configs.map((c: any) => {
    const decoded = iface.decodeFunctionResult("getExtensionConfig", c);
    const extensionFunctionSelectors = decoded[0].extensionABI.map(
      (a: any) => a.selector,
    );

    return [...decoded[0].callbackFunctions, ...extensionFunctionSelectors];
  });

  return hasDuplicates(
    selectors.flat(),
    (a: string, b: string): boolean => a === b,
  );
}
