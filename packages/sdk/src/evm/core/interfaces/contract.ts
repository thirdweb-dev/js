import { NetworkOrSignerOrProvider } from "../types";

/**
 * @public
 */
export interface UpdateableNetwork {
  onNetworkUpdated(network: NetworkOrSignerOrProvider): void;
  getAddress(): string;
  chainId: number;
}
