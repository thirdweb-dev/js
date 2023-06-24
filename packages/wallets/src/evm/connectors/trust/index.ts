import { InjectedConnector, InjectedConnectorOptions } from "../injected";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";
import { Ethereum } from "../injected/types";
import type { Chain } from "@thirdweb-dev/chains";
import { AsyncStorage } from "../../../core/AsyncStorage";

type TrustConnectorConstructorArg = {
  chains?: Chain[];
  connectorStorage: AsyncStorage;
  options?: InjectedConnectorOptions;
};

export class TrustConnector extends InjectedConnector {
  constructor(arg: TrustConnectorConstructorArg) {
    const defaultOptions = {
      name: "Trust",
      getProvider() {
        function getReady(ethereum?: Ethereum) {
          const isTrust = !!ethereum?.isTrust;
          if (!isTrust) {
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
