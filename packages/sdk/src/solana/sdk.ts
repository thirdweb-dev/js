import { Deployer } from "./classes/deployer";
import { Registry } from "./classes/registry";
import { UserWallet } from "./classes/user-wallet";
import { NFTCollection } from "./programs/nft-collection";
import { NFTDrop } from "./programs/nft-drop";
import type { Program } from "./programs/program";
import { Token } from "./programs/token";
import {
  PrebuiltProgramType,
  ProgramForPrebuiltProgramType,
  ProgramType,
} from "./programs/types";
import { Network } from "./types";
import { getUrlForNetwork } from "./utils/urls";
import { Metaplex } from "@metaplex-foundation/js";
import type { Idl, Program as AnchorProgram } from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import { IpfsUploader, ThirdwebStorage } from "@thirdweb-dev/storage";
import Bs58 from "bs58";

/**
 * The main entry-point for the thirdweb Solana SDK.
 *
 * @example
 * ```jsx
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
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
    const url = new URL(this.connection.rpcEndpoint);
    // try this first to avoid hitting `custom` network for alchemy urls
    if (url.hostname.includes("devnet")) {
      return "devnet";
    }
    if (url.hostname.includes("mainnet")) {
      return "mainnet-beta";
    }
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
    this.registry = new Registry(this.metaplex, this.wallet);
    this.deployer = new Deployer(this.registry, this.metaplex, this.storage);
  }

  get auth() {
    throw new Error(
      `The sdk.auth namespace has been moved to the @thirdweb-dev/auth package and is no longer available after @thirdweb-dev/sdk >= 3.7.0. 
      Please visit https://portal.thirdweb.com/auth for instructions on how to switch to using the new auth package (@thirdweb-dev/auth@3.0.0).
      
      If you still want to use the old @thirdweb-dev/auth@2.0.0 package, you can downgrade the SDK to version 3.6.0.`,
    );
  }

  /**
   * Get an SDK interface for an NFT Collection program
   * @param address - Address of the program
   * @returns SDK interface for the program
   */
  public async getNFTCollection(address: string): Promise<NFTCollection> {
    return this.getProgram(address, "nft-collection");
  }

  /**
   * Get an SDK interface for an NFT Drop program
   * @param address - Address of the program
   * @returns SDK interface for the program
   */
  public async getNFTDrop(address: string): Promise<NFTDrop> {
    return this.getProgram(address, "nft-drop");
  }

  /**
   * Get an SDK interface for an Token program
   * @param address - Address of the program
   * @returns SDK interface for the program
   */
  public async getToken(address: string): Promise<Token> {
    return this.getProgram(address, "token");
  }

  /**
   * Get an SDK interface for a deployed program
   * @param address - Address of the program
   * @returns SDK interface for the program
   *
   * @example
   * ```jsx
   * // Get the interface for your anchor program
   * const program = await sdk.getProgram("{{program_address}}");
   * ```
   */
  public async getProgram(address: string): Promise<AnchorProgram>;
  /**
   * Get an SDK interface for a deployed program
   * @param address - Address of the program
   * @param programType - the type of program
   * @returns SDK interface for the program
   *
   * @example
   * ```jsx
   * // Get the interface a given program type
   * const program = await sdk.getProgram("{{program_address}}", "token");
   * ```
   */
  public async getProgram<TProgramType extends ProgramType>(
    address: string,
    programType: TProgramType,
  ): Promise<
    TProgramType extends PrebuiltProgramType
      ? ProgramForPrebuiltProgramType<TProgramType>
      : Program
  >;
  /**
   * Get an SDK interface for a deployed program
   * @param address - Address of the program
   * @param Idl - the IDL of the program
   * @returns SDK interface for the program
   *
   * @example
   * ```jsx
   * // Get the interface for your anchor program
   * const program = await sdk.getProgram("{{program_address}}", Idl);
   * ```
   */
  public async getProgram<TIdl extends Idl>(
    address: string,
    Idl: TIdl,
  ): Promise<AnchorProgram<TIdl>>;
  public async getProgram(
    address: string,
    programTypeOrIdl?: ProgramType | Idl,
  ): Promise<AnchorProgram | Program | NFTCollection | NFTDrop | Token> {
    // if we have a programType or IDL
    if (programTypeOrIdl) {
      // if it's a prebuilt program type
      if (typeof programTypeOrIdl === "string") {
        switch (programTypeOrIdl) {
          case "nft-collection":
            return new NFTCollection(address, this.metaplex, this.storage);
          case "nft-drop":
            return new NFTDrop(address, this.metaplex, this.storage);
          case "token":
            return new Token(address, this.metaplex, this.storage);
          default:
            throw new Error("Invalid program type");
        }
      }
      // otherwise, it's an IDL, so return a program with that IDL
      return this.getProgramWithIdl(address, programTypeOrIdl);
    }
    const anchor = await import("@project-serum/anchor");
    const idl = await anchor.Program.fetchIdl(
      address,
      new anchor.AnchorProvider(this.connection, this.metaplex.identity(), {}),
    );
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
   *
   * @example
   * ```jsx
   * import idl from "path/to/idl.json"
   *
   * // Alternatively, you can pass in your own IDL
   * const program = await sdk.getProgramWithIdl(address, idl);
   * ```
   */
  public async getProgramWithIdl(address: string, idl: Idl) {
    const program = await import("./programs/program");
    return new program.Program(address, idl, this.connection, this.wallet);
  }
}
