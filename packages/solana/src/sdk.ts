import { Deployer } from "./classes/deployer";
import { Registry } from "./classes/registry";
import { UserWallet } from "./classes/user-wallet";
import { DEFAULT_IPFS_GATEWAY } from "./constants/urls";
import { NFTCollection } from "./contracts/nft-collection";
import { NFTDrop } from "./contracts/nft-drop";
import { Program } from "./contracts/program";
import { Token } from "./contracts/token";
import { Network } from "./types";
import { getUrlForNetwork } from "./utils/urls";
import {
  isIdentitySigner,
  isKeypairSigner,
  keypairIdentity,
  Metaplex,
  Signer,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import {
  AnchorProvider,
  Idl,
  Program as AnchorProgram,
} from "@project-serum/anchor";
import { registry } from "@project-serum/anchor/dist/cjs/utils";
import { Connection, Keypair } from "@solana/web3.js";
import { IpfsStorage, IStorage, PinataUploader } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

export class ThirdwebSDK {
  static fromNetwork(network: Network, storage?: IStorage): ThirdwebSDK {
    return new ThirdwebSDK(new Connection(getUrlForNetwork(network)), storage);
  }

  private connection: Connection;
  private metaplex: Metaplex;
  private anchorProvider: AnchorProvider;
  private storage: IStorage;

  public registry: Registry;
  public deployer: Deployer;
  public wallet: UserWallet;

  constructor(
    connection: Connection,
    storage: IStorage = new IpfsStorage(
      DEFAULT_IPFS_GATEWAY,
      new PinataUploader(),
      {
        appendGatewayUrl: true,
      },
    ),
  ) {
    this.connection = connection;
    this.storage = storage;
    this.metaplex = Metaplex.make(this.connection);
    this.wallet = new UserWallet();
    this.deployer = new Deployer(this.metaplex, this.wallet, this.storage);
    this.registry = new Registry(this.metaplex);
    this.anchorProvider = new AnchorProvider(
      this.metaplex.connection,
      this.metaplex.identity(),
      {},
    );
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

  public async getNFTDrop(address: string): Promise<NFTDrop> {
    return new NFTDrop(address, this.metaplex, this.wallet, this.storage);
  }

  public async getToken(address: string): Promise<Token> {
    return new Token(address, this.metaplex, this.wallet, this.storage);
  }

  public async getProgram(address: string) {
    const idl = await AnchorProgram.fetchIdl(address, this.anchorProvider);
    if (!idl) {
      throw new Error(
        `Could not fetch IDL for program at address '${address}'`,
      );
    }
    return this.getProgramWithIdl(address, idl);
  }

  public async getProgramWithIdl(address: string, idl: Idl) {
    return new Program(address, idl, this.anchorProvider);
  }

  private propagateSignerUpdated(signer: Signer) {
    this.metaplex = this.connectToMetaplex(signer, this.metaplex);
    this.anchorProvider = new AnchorProvider(
      this.metaplex.connection,
      this.metaplex.identity(),
      {},
    );
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
