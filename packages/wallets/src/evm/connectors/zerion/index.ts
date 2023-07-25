import { InjectedConnector, InjectedConnectorOptions } from "../injected";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";
import { Ethereum } from "../injected/types";
import type { Chain } from "@thirdweb-dev/chains";
import { AsyncStorage } from "../../../core/AsyncStorage";

type ZerionConnectorConstructorArg = {
  chains?: Chain[];
  connectorStorage: AsyncStorage;
  options?: InjectedConnectorOptions;
};

export class ZerionConnector extends InjectedConnector {
  constructor(arg: ZerionConnectorConstructorArg) {
    const defaultOptions = {
      name: "Zerion",
      getProvider() {
        function getReady(ethereum?: Ethereum) {
          const isZerion = !!ethereum?.isZerion;
          if (!isZerion) {
            return;
          }
          return ethereum;
        }

        if (typeof window === "undefined") {
          return;
        }
        if (assertWindowEthereum(globalThis.window)) {
          if (globalThis.window.ethereum?.providers) {
            return globalThis.window.ethereum.providers.find(getReady);
          }

          return getReady(globalThis.window.ethereum);
        }
      },
    };
    const options = {
      ...defaultOptions,
      ...arg.options,
    };
    super({
      chains: arg.chains,
      options,
      connectorStorage: arg.connectorStorage,
    });
  }
}
