import { getSignerAndProvider } from "../../../constants/urls";
import {
  SDKOptions,
  SDKOptionsOutput,
  SDKOptionsSchema,
} from "../../../schema/sdk-options";
import { NetworkInput } from "../../types";
import type { Signer, providers } from "ethers";
import EventEmitter from "eventemitter3";

/**
 * @internal
 */
export class RPCConnectionHandler extends EventEmitter {
  private provider: providers.Provider;
  private signer: Signer | undefined;
  public network: NetworkInput;
  public readonly options: SDKOptionsOutput;

  constructor(network: NetworkInput, options: SDKOptions) {
    super();
    try {
      this.options = SDKOptionsSchema.parse(options);
    } catch (optionParseError) {
      console.error(
        "invalid sdk options object passed, falling back to default options",
        optionParseError,
      );
      this.options = SDKOptionsSchema.parse({});
    }
    const [signer, provider] = getSignerAndProvider(network, this.options);
    this.network = network;
    this.signer = signer;
    this.provider = provider;
  }
  /**
   * The function to call whenever the network changes, such as when the users connects their wallet, disconnects their wallet, the connected chain changes, etc.
   *
   * @param network - a network, signer or provider that ethers js can interpret
   */
  public updateSignerOrProvider(network: NetworkInput) {
    const [signer, provider] = getSignerAndProvider(network, this.options);
    this.network = network;
    this.signer = signer;
    this.provider = provider;
  }

  /**
   * Explicitly get the active signer.
   * @returns The active signer, if there is one
   */
  public getSigner(): Signer | undefined {
    return this.signer;
  }

  /**
   * Explicitly get the active provider.
   * @returns The active provider
   */
  public getProvider(): providers.Provider {
    return this.provider;
  }

  /**
   *
   * @returns The current signer if there is one, otherwise the active provider
   */
  public getSignerOrProvider(): Signer | providers.Provider {
    return this.getSigner() || this.getProvider();
  }
}
