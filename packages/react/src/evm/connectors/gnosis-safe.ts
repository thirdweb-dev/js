import { useConnect } from "../hooks/wagmi-required/useConnect";
import { Signer, ethers, utils } from "ethers";
import invariant from "tiny-invariant";
import {
  Chain,
  Connector,
  ConnectorData,
  normalizeChainId,
  useContext as useWagmiContext,
} from "wagmi";

// exerpt from https://docs.gnosis-safe.io/backend/available-services
const CHAIN_ID_TO_GNOSIS_SERVER_URL = {
  // mainnet
  1: "https://safe-transaction-mainnet.safe.global",
  // avalanche
  43114: "https://safe-transaction-avalanche.safe.global",
  // polygon
  137: "https://safe-transaction-polygon.safe.global",
  // goerli
  5: "https://safe-transaction-goerli.safe.global",
  // bsc
  56: "https://safe-transaction-bsc.safe.global",
  // optimism
  10: "https://safe-transaction-optimism.safe.global",
} as const;

export interface GnosisConnectorArguments {
  safeAddress: string;
  safeChainId: number;
}

const __IS_SERVER__ = typeof window === "undefined";

export class GnosisSafeConnector extends Connector {
  static supportedChains = Object.keys(CHAIN_ID_TO_GNOSIS_SERVER_URL);
  public supportedChains = GnosisSafeConnector.supportedChains;
  id = "gnosis";
  ready = __IS_SERVER__;
  name = "Gnosis Safe";
  // config
  public previousConnector?: Connector<any>;
  private config?: GnosisConnectorArguments;
  private safeSigner?: Signer;

  constructor(config: { chains?: Chain[] }) {
    // filter out any chains that gnosis doesnt support before passing to connector
    config.chains = config.chains?.filter(
      (c) => c.id in CHAIN_ID_TO_GNOSIS_SERVER_URL,
    );
    super({ ...config, options: undefined });

    if (!__IS_SERVER__) {
      this.ready = true;
    }
  }

  async connect(): Promise<ConnectorData<any>> {
    this.safeSigner = await this.createSafeSigner();
    const account = await this.getAccount();
    const provider = await this.getProvider();
    const id = await this.getChainId();
    return {
      account,
      provider,
      chain: { id, unsupported: this.isChainUnsupported(id) },
    };
  }

  public isChainSupported(chainId: string | number) {
    const id = normalizeChainId(chainId);
    return !this.isChainUnsupported(id);
  }

  private async createSafeSigner() {
    const signer = await this.previousConnector?.getSigner();
    const safeAddress = this.config?.safeAddress;
    const safeChainId = this.config
      ?.safeChainId as keyof typeof CHAIN_ID_TO_GNOSIS_SERVER_URL;
    invariant(
      signer,
      "cannot create Gnosis Safe signer without a personal signer",
    );
    const signerChainId = await signer.getChainId();
    invariant(
      signerChainId === safeChainId,
      "chainId of personal signer has to match safe chainId",
    );
    invariant(
      safeAddress,
      "safeConfig.safeAddress is required, did you forget to call setSafeConfig?",
    );
    invariant(
      safeChainId,
      "safeConfig.safeChainId is required, did you forget to call setSafeConfig?",
    );
    const serverUrl = CHAIN_ID_TO_GNOSIS_SERVER_URL[safeChainId];
    invariant(serverUrl, "Chain not supported");

    const [safeEthersAdapters, safeCoreSdk, safeEthersLib] = await Promise.all([
      import("@gnosis.pm/safe-ethers-adapters"),
      import("@gnosis.pm/safe-core-sdk"),
      import("@gnosis.pm/safe-ethers-lib"),
    ]);

    const ethAdapter = new safeEthersLib.default({
      ethers,
      signerOrProvider: signer,
    });

    const safe = await safeCoreSdk.default.create({
      ethAdapter: ethAdapter as any,
      safeAddress,
    });
    const service = new safeEthersAdapters.SafeService(serverUrl);
    return new safeEthersAdapters.SafeEthersSigner(
      safe as any,
      service,
      signer.provider,
    );
  }

  async disconnect(): Promise<void> {
    this.config = undefined;
    this.safeSigner = undefined;
    this.previousConnector = undefined;
    return undefined;
  }

  async getAccount(): Promise<string> {
    const signer = await this.getSigner();
    return await signer.getAddress();
  }

  async getChainId(): Promise<number> {
    return (await this.getSigner()).getChainId();
  }

  async getProvider() {
    return (await this.getSigner()).provider;
  }

  async getSigner(): Promise<Signer> {
    if (!this.safeSigner) {
      this.safeSigner = await this.createSafeSigner();
    }
    return this.safeSigner;
  }

  async isAuthorized(): Promise<boolean> {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  protected onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: utils.getAddress(accounts[0]) });
    }
  }

  protected override isChainUnsupported(chainId: number) {
    return this.config?.safeChainId
      ? chainId === this.config.safeChainId
      : false;
  }

  protected onChainChanged(chainId: string | number) {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  protected onDisconnect() {
    this.emit("disconnect");
  }

  public setConfiguration(
    connector: Connector<any>,
    config: GnosisConnectorArguments,
  ) {
    this.previousConnector = connector;
    this.config = config;
  }
}

/**
 * Hook for connecting to a Gnosis Safe. This enables multisig wallets to connect to your application and sing transactions.
 *
 * ```javascript
 * import { useGnosis } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * ```javascript
 * import { useGnosis } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const connectWithGnosis = useGnosis()
 *
 *   return (
 *     <button onClick={() => connectWithGnosis({ safeAddress: "0x...", safeChainId: 1 })}>
 *       Connect Gnosis Safe
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useGnosis() {
  const wagmiContext = useWagmiContext();
  invariant(
    wagmiContext,
    `useGnosis() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own wallet-connection logic.`,
  );
  const [connectors, connect] = useConnect();
  if (connectors.loading) {
    return () => Promise.reject("Gnosis connector not ready to be used, yet");
  }
  const connector = connectors.data.connectors.find((c) => c.id === "gnosis");
  invariant(
    connector,
    "Gnosis connector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  return async (config: GnosisConnectorArguments) => {
    const previousConnector = connectors.data.connector;
    const previousConnectorChain = await previousConnector?.getChainId();
    invariant(
      !!previousConnector,
      "Cannot connect to Gnosis Safe without first being connected to a personal wallet.",
    );
    invariant(
      previousConnectorChain === config.safeChainId,
      "Gnosis safe chain id must match personal wallet chain id.",
    );
    invariant(
      utils.isAddress(config.safeAddress),
      "Gnosis safe address must be a valid address.",
    );
    (connector as GnosisSafeConnector).setConfiguration(
      previousConnector,
      config,
    );
    return connect(connector);
  };
}
