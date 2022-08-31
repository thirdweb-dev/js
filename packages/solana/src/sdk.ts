import { Deployer } from "./classes/deployer";
import { UserWallet } from "./classes/user-wallet";
import { NFTCollection } from "./contracts/nft-collection";
import { Network } from "./types";
import { getUrlForNetwork } from "./utils/urls";
import {
  isIdentitySigner,
  isKeypairSigner,
  keypairIdentity,
  Metaplex,
  mockStorage,
  Signer,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import { IpfsStorage, IStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

export class ThirdwebSDK {
  static fromNetwork(
    network: Network,
    storage: IStorage = new IpfsStorage(),
  ): ThirdwebSDK {
    return new ThirdwebSDK(new Connection(getUrlForNetwork(network)), storage);
  }

  private connection: Connection;
  private metaplex: Metaplex;
  private storage: IStorage;

  public deployer: Deployer;
  public wallet: UserWallet;

  constructor(connection: Connection, storage: IStorage = new IpfsStorage()) {
    this.connection = connection;
    this.storage = storage;
    this.metaplex = Metaplex.make(this.connection);
    this.wallet = new UserWallet();
    this.deployer = new Deployer(this.metaplex, this.wallet, this.storage);
    // when there is a new signer connected in the wallet sdk, update that signer
    this.wallet.events.on("connected", (s) => {
      this.propagateSignerUpdated(s);
    });
    // when the wallet disconnects, update the signer to undefined
    this.wallet.events.on("disconnected", () => {
      // reset connection to Metaplex
      this.metaplex = Metaplex.make(this.connection);
    });
  }

  public async getNFTCollection(address: string): Promise<NFTCollection> {
    return new NFTCollection(address, this.metaplex, this.wallet, this.storage);
  }

  private propagateSignerUpdated(signer: Signer) {
    this.metaplex = this.connectToMetaplex(signer, this.metaplex);
  }

  private connectToMetaplex(signer: Signer, metaplex: Metaplex) {
    invariant(signer, "Wallet is not connected");
    const plugin = isKeypairSigner(signer)
      ? keypairIdentity(Keypair.fromSecretKey(signer.secretKey))
      : isIdentitySigner(signer)
      ? walletAdapterIdentity(signer)
      : undefined;
    invariant(plugin, "Wallet is not compatible with Metaplex");
    return metaplex.use(plugin);
  }
}
