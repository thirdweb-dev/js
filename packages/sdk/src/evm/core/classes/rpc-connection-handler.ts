import { getReadOnlyProvider } from "../../constants/urls";
import {
  SDKOptions,
  SDKOptionsOutput,
  SDKOptionsSchema,
} from "../../schema/sdk-options";
import { NetworkOrSignerOrProvider } from "../types";
import { ethers, Signer, providers } from "ethers";
import EventEmitter from "eventemitter3";

/**
 * @internal
 */
export class RPCConnectionHandler extends EventEmitter {
  private provider: providers.Provider;
  private signer: Signer | undefined;
  public readonly options: SDKOptionsOutput;

  constructor(network: NetworkOrSignerOrProvider, options: SDKOptions) {
    super();
    const [signer, provider] = getSignerAndProvider(network, options);
    this.signer = signer;
    this.provider = provider;

    try {
      this.options = SDKOptionsSchema.parse(options);
    } catch (optionParseError) {
      console.error(
        "invalid sdk options object passed, falling back to default options",
        optionParseError,
      );
      this.options = SDKOptionsSchema.parse({});
    }
  }
  /**
   * The function to call whenever the network changes, such as when the users connects their wallet, disconnects their wallet, the connected chain changes, etc.
   *
   * @param network - a network, signer or provider that ethers js can interpret
   */
  public updateSignerOrProvider(network: NetworkOrSignerOrProvider) {
    const [signer, provider] = getSignerAndProvider(network, this.options);
    this.signer = signer;
    this.provider = provider;
  }
  /**
   *
   * @returns whether or not a signer is set, `true` if there is no signer so the class is in "read only" mode
   */
  public isReadOnly(): boolean {
    return !Signer.isSigner(this.signer);
  }

  /**
   * Explicitly get the active signer.
   * @returns the active signer, if there is one
   */
  public getSigner(): Signer | undefined {
    return this.signer;
  }

  /**
   * Explicitly get the active provider.
   * @returns the active provider
   */
  public getProvider(): providers.Provider {
    return this.provider;
  }

  /**
   *
   * @returns the current signer if there is one, otherwise the active provider
   */
  public getSignerOrProvider(): Signer | providers.Provider {
    return this.getSigner() || this.getProvider();
  }
}

/**
 * @internal
 */
export function getSignerAndProvider(
  network: NetworkOrSignerOrProvider,
  options: SDKOptions,
): [Signer | undefined, providers.Provider] {
  let signer: Signer | undefined;
  let provider: providers.Provider | undefined;

  if (Signer.isSigner(network)) {
    signer = network;
    if (network.provider) {
      provider = network.provider;
    }
  }

  if (options?.readonlySettings) {
    provider = getReadOnlyProvider(
      options.readonlySettings.rpcUrl,
      options.readonlySettings.chainId,
    );
  }

  if (!provider) {
    if (providers.Provider.isProvider(network)) {
      provider = network;
    } else if (!Signer.isSigner(network)) {
      if (typeof network === "string") {
        provider = getReadOnlyProvider(
          network,
          options?.readonlySettings?.chainId,
        );
      } else {
        // no a signer, not a provider, not a string? try with default provider
        provider = ethers.getDefaultProvider(network);
      }
    }
  }

  if (!provider) {
    // we should really never hit this case!
    provider = ethers.getDefaultProvider();
    console.error(
      "No provider found, using default provider on default chain!",
    );
  }

  return [signer, provider];
}
