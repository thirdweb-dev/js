import { providers } from "ethers";
import { extensionContractAbi } from "../../constants/thirdweb-features";
import { Contract as EthersContract } from "ethers";
import { hasDuplicates } from "../utils";

type ExtensionFunction = {
    selector: string;
    callType: number;
    permissioned: string;
}

type ExtensionConfig = {
    callbackFunctions: string[];
    extensionABI: ExtensionFunction[];
}

export async function compatibleExtensions(
  extensionAddresses: string[],
  provider: providers.Provider,
): Promise<boolean> {
  const configs = await Promise.all(
    extensionAddresses.map((addr: string) => {
      const contract = new EthersContract(addr, extensionContractAbi, provider);

      return contract.getExtensionConfig();
    }),
  );

  const selectors = configs.map((c: ExtensionConfig) => {
    const extensionFunctionSelectors = c.extensionABI.map(a => a.selector);
    return [...c.callbackFunctions, ...extensionFunctionSelectors];
  });

  return hasDuplicates(selectors.flat(), (a: string, b: string): boolean => a === b);
}
