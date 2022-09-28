import { Deployer } from "./classes/deployer";
import { Registry } from "./classes/registry";
import { UserWallet } from "./classes/user-wallet";
import { NFTCollection } from "./contracts/nft-collection";
import { NFTDrop } from "./contracts/nft-drop";
import { Program } from "./contracts/program";
import { Token } from "./contracts/token";
import { Network } from "./types";
import { getUrlForNetwork } from "./utils/urls";
import { Metaplex } from "@metaplex-foundation/js";
import {
  AnchorProvider,
  Idl,
  Program as AnchorProgram,
  setProvider,
} from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import { IpfsUploader, ThirdwebStorage } from "@thirdweb-dev/storage";
import Bs58 from "bs58";

/**
 * The main entry-point for the thirdweb Solana SDK.
 *
 * @example
 * ```jsx
 * import { ThirdwebSDK } from "@thirdweb-dev/solana";
 *
 * // Create SDK on specified network, and then pass a signer
 * const sdk = ThirdwebSDK.fromNetwork("devnet");
 * // Signer can be a keypair or browser wallet adapter
 * sdk.wallet.connect(signer);
 * ```
 *
 * @public
 */
export class ThirdwebSDK {
  /**
   * Create a new SDK instance for the specified network
   * @param network - The network to connect to
   * @param storage - The storage provider to use or IPFS by default
   * @returns an SDK instance
   */
  static fromNetwork(network: Network, storage?: ThirdwebStorage): ThirdwebSDK {
    return new ThirdwebSDK(
      new Connection(getUrlForNetwork(network), {
        disableRetryOnRateLimit: true,
        commitment: "confirmed",
      }),
      storage,
    );
  }

  /**
   * reate a new SDK instance connected with the given private key
   * @param network - The network to connect to
   * @param privateKey - The private key to use
   * @param storage - The storage provider to use or IPFS by default
   * @returns an SDK instance
   */
  static fromPrivateKey(
    network: Network,
    privateKey: string,
    storage?: ThirdwebStorage,
  ): ThirdwebSDK {
    const sdk = ThirdwebSDK.fromNetwork(network, storage);
    const keypair = Keypair.fromSecretKey(Bs58.decode(privateKey));
    sdk.wallet.connect(keypair);
    return sdk;
  }

  private connection: Connection;
  private metaplex: Metaplex;
  private anchorProvider: AnchorProvider;
  private storage: ThirdwebStorage;

  /**
   * Handles getting data about accounts and programs associated with a wallet
   */
  public registry: Registry;
  /**
   * Deploy new programs
   */
  public deployer: Deployer;
  /**
   * Manage and get info about the connected wallet
   */
  public wallet: UserWallet;
  /**
   * The currently connected network
   */
  public get network() {
    return this.metaplex.cluster;
  }

  constructor(
    connection: Connection,
    storage: ThirdwebStorage = new ThirdwebStorage({
      uploader: new IpfsUploader({ uploadWithGatewayUrl: true }),
    }),
  ) {
    this.connection = connection;
    this.storage = storage;
    this.metaplex = Metaplex.make(this.connection);
    this.wallet = new UserWallet(this.metaplex);
    this.deployer = new Deployer(this.metaplex, this.storage);
    this.registry = new Registry(this.metaplex);
    this.anchorProvider = new AnchorProvider(
      this.metaplex.connection,
      this.metaplex.identity(),
      {},
    );
    this.wallet.events.on("connected", () => {
      this.propagateWalletConnected();
    });
    this.wallet.events.on("disconnected", () => {
      this.propagateWalletDisconnected();
    });
  }

  /**
   * Get an SDK interface for an NFT Collection program
   * @param address - Address of the program
   * @returns SDK interface for the program
   */
  public async getNFTCollection(address: string): Promise<NFTCollection> {
    return new NFTCollection(address, this.metaplex, this.storage);
  }

  /**
   * Get an SDK interface for an NFT Drop program
   * @param address - Address of the program
   * @returns SDK interface for the program
   */
  public async getNFTDrop(address: string): Promise<NFTDrop> {
    return new NFTDrop(address, this.metaplex, this.storage);
  }

  /**
   * Get an SDK interface for an Token program
   * @param address - Address of the program
   * @returns SDK interface for the program
   */
  public async getToken(address: string): Promise<Token> {
    return new Token(address, this.metaplex, this.storage);
  }

  /**
   * Get an SDK interface for a deployed program
   * @param address - Address of the program
   * @returns SDK interface for the program
   */
  public async getProgram(address: string) {
    const idl = await AnchorProgram.fetchIdl(address, this.anchorProvider);
    if (!idl) {
      throw new Error(
        `Could not fetch IDL for program at address '${address}'`,
      );
    }
    return this.getProgramWithIdl(address, idl);
  }

  /**
   * Get an SDK interface for a deployed program
   * @param address - Address of the program
   * @param idl - The IDL of the program
   * @returns SDK interface for the program
   */
  public async getProgramWithIdl(address: string, idl: Idl) {
    return new Program(address, idl, this.anchorProvider);
  }

  private propagateWalletConnected() {
    setProvider(
      new AnchorProvider(this.connection, this.metaplex.identity(), {}),
    );
  }

  private propagateWalletDisconnected() {
    // metaplex.identity() will return a guest identity
    setProvider(
      new AnchorProvider(this.connection, this.metaplex.identity(), {}),
    );
  }
}
