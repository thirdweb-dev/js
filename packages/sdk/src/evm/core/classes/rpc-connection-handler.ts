import { getChainProvider, getProviderFromRpcUrl } from "../../constants/urls";
import {
  SDKOptions,
  SDKOptionsOutput,
  SDKOptionsSchema,
} from "../../schema/sdk-options";
import { NetworkInput } from "../types";
import { Signer, providers } from "ethers";
import EventEmitter from "eventemitter3";

/**
 * @internal
 */
export class RPCConnectionHandler extends EventEmitter {
  private provider: providers.Provider;
  private signer: Signer | undefined;
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
  network: NetworkInput,
  options: SDKOptions,
): [Signer | undefined, providers.Provider] {
  let signer: Signer | undefined;
  let provider: providers.Provider | undefined;

  if (Signer.isSigner(network)) {
    // Here, we have an ethers.Signer
    signer = network;
    if (network.provider) {
      provider = network.provider;
    }
  } else if (providers.Provider.isProvider(network)) {
    // Here, we have an ethers.providers.Provider
    provider = network;
  } else {
    // Here, we must have a ChainOrRpcUrl, which is a chain name, chain id, rpc url, or chain config
    // All of which, getChainProvider can handle for us
    provider = getChainProvider(network, options);
  }

  if (options?.readonlySettings && !provider) {
    // If readonly settings are specified, then overwrite the provider
    provider = getProviderFromRpcUrl(
      options.readonlySettings.rpcUrl,
      options.readonlySettings.chainId,
    );
  }

  // At this point, if we don't have a provider, don't default to a random chain
  // Instead, just throw an error
  if (!provider) {
    if (signer) {
      throw new Error(
        "No provider passed to the SDK! Please make sure that your signer is connected to a provider!",
      );
    }

    throw new Error(
      "No provider found! Make sure to specify which network to connect to, or pass a signer or provider to the SDK!",
    );
  }

  return [signer, provider];
}
