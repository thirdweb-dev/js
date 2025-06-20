import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { eth_call } from "../../../rpc/actions/eth_call.js";
import { getRpcClient } from "../../../rpc/rpc.js";
import { hasDuplicates } from "../../../utils/arrays.js";
import { ensureBytecodePrefix } from "../../../utils/bytecode/prefix.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import {
  decodeSupportsInterfaceResult,
  encodeSupportsInterface,
} from "../../erc165/__generated__/IERC165/read/supportsInterface.js";
import {
  decodeGetSupportedCallbackFunctionsResult,
  FN_SELECTOR as getSupportedCallbackFunctionsSelector,
} from "../__generated__/IModularCore/read/getSupportedCallbackFunctions.js";
import {
  decodeGetModuleConfigResult,
  FN_SELECTOR as getModuleConfigSelector,
} from "../__generated__/IModule/read/getModuleConfig.js";

/**
 * Check if the given modules are compatible with the given core contract
 * @param options
 * @modules
 */
export async function checkModulesCompatibility(options: {
  coreBytecode: string;
  moduleBytecodes: string[];
  chain: Chain;
  client: ThirdwebClient;
}): Promise<boolean> {
  const addr = "0x0000000000000000000000000000000000000124"; // arbitrary address
  let _coreBytecode = ensureBytecodePrefix(options.coreBytecode);
  if (!_coreBytecode.startsWith("0x6080604052")) {
    const index = _coreBytecode.indexOf("6080604052");
    _coreBytecode = `0x${_coreBytecode.substring(index)}`;
  } else if (_coreBytecode.lastIndexOf("6080604052") > 0) {
    const index = _coreBytecode.lastIndexOf("6080604052");
    _coreBytecode = `0x${_coreBytecode.substring(index)}`;
  }
  const rpcClient = getRpcClient({
    chain: options.chain,
    client: options.client,
  });

  // get the core's supported callback functions
  const coreCallResult = await eth_call(rpcClient, {
    data: getSupportedCallbackFunctionsSelector,
    stateOverrides: {
      [addr]: {
        code: _coreBytecode,
      },
    },
    to: addr,
  });

  const decodedCallResult =
    decodeGetSupportedCallbackFunctionsResult(coreCallResult);
  const coreCallbackSelectors = decodedCallResult.flat().map((c) => c.selector);

  // get the module config for each module
  const modules = await Promise.all(
    options.moduleBytecodes.map(async (b: string) => {
      // TODO: Upload deployed bytecode on publish metadata
      let moduleBytecode = ensureBytecodePrefix(b);
      if (!moduleBytecode.startsWith("0x6080604052")) {
        const index = moduleBytecode.indexOf("6080604052");
        moduleBytecode = `0x${moduleBytecode.substring(index)}`;
      } else if (moduleBytecode.lastIndexOf("6080604052") > 0) {
        const index = moduleBytecode.lastIndexOf("6080604052");
        moduleBytecode = `0x${moduleBytecode.substring(index)}`;
      }

      const callResult = await eth_call(rpcClient, {
        data: getModuleConfigSelector,
        stateOverrides: {
          [addr]: {
            code: moduleBytecode,
          },
        },
        to: addr,
      });
      return decodeGetModuleConfigResult(callResult);
    }),
  );

  // check if callback selectors are supported
  for (const module of modules) {
    for (const callback of module.callbackFunctions) {
      if (!coreCallbackSelectors.includes(callback.selector)) {
        return false;
      }
    }
  }

  // check if the core contract supports required interfaces by modules above
  const requiredInterfaces = modules.flatMap((m) => m.requiredInterfaces);
  if (requiredInterfaces.length > 0) {
    const supportsInterfaceResult = await Promise.all(
      requiredInterfaces.map(async (r) => {
        const callResult = await eth_call(rpcClient, {
          data: encodeSupportsInterface({
            interfaceId: r,
          }),
          stateOverrides: {
            [addr]: {
              code: _coreBytecode,
            },
          },
          to: addr,
        });
        return decodeSupportsInterfaceResult(callResult);
      }),
    );

    if (supportsInterfaceResult.flat().some((element) => element === false)) {
      return false;
    }
  }
  return !hasDuplicates(
    [
      ...modules.flatMap((m) => m.callbackFunctions.map((c) => c.selector)),
      ...modules.flatMap((m) => m.fallbackFunctions.map((f) => f.selector)),
    ],
    (a: Hex | undefined, b: Hex | undefined): boolean => a === b,
  );
}
