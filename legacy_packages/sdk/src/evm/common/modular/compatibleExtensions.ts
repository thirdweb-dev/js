import { providers, utils } from "ethers";
import { extensionContractAbi } from "../../constants/thirdweb-features";
import { hasDuplicates } from "../utils";
import { getChainByChainIdAsync, getChainRPC } from "@thirdweb-dev/chains";

type ExtensionFunction = {
  selector: string;
  callType: number;
  permissioned: string;
};

type ExtensionConfig = {
  callbackFunctions: string[];
  extensionABI: ExtensionFunction[];
};

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
