import { ChainId } from "@thirdweb-dev/sdk";
import { Signer, ethers, utils } from "ethers";
import invariant from "tiny-invariant";
import { Chain, Connector, ConnectorData, normalizeChainId } from "wagmi";

const CHAIN_ID_TO_GNOSIS_SERVER_URL = {
  [ChainId.Mainnet]: "https://safe-transaction.mainnet.gnosis.io",
  [ChainId.Avalanche]: "https://safe-transaction.avalanche.gnosis.io",
  [ChainId.Polygon]: "https://safe-transaction.polygon.gnosis.io",
  [ChainId.Goerli]: "https://safe-transaction.goerli.gnosis.io",
  [ChainId.Rinkeby]: "https://safe-transaction.rinkeby.gnosis.io",
};

export interface GnosisConnectorArguments {
  safeAddress: string;
  safeChainId: number;
}

const __IS_SERVER__ = typeof window === "undefined";

export class GnosisSafeConnector extends Connector {
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

    const ethAdapter = new safeEthersLib.default({ ethers, signer });

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
