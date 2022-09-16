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
import { Connection } from "@solana/web3.js";
import { IpfsUploader, ThirdwebStorage } from "@thirdweb-dev/storage";

export class ThirdwebSDK {
  static fromNetwork(network: Network, storage?: ThirdwebStorage): ThirdwebSDK {
    return new ThirdwebSDK(new Connection(getUrlForNetwork(network)), storage);
  }

  private connection: Connection;
  private metaplex: Metaplex;
  private anchorProvider: AnchorProvider;
  private storage: ThirdwebStorage;

  public registry: Registry;
  public deployer: Deployer;
  public wallet: UserWallet;

  constructor(
    connection: Connection,
    storage: ThirdwebStorage = new ThirdwebStorage(
      new IpfsUploader({ uploadWithGatewayUrl: true }),
    ),
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

  public async getNFTCollection(address: string): Promise<NFTCollection> {
    return new NFTCollection(address, this.metaplex, this.storage);
  }

  public async getNFTDrop(address: string): Promise<NFTDrop> {
    return new NFTDrop(address, this.metaplex, this.storage);
  }

  public async getToken(address: string): Promise<Token> {
    return new Token(address, this.metaplex, this.storage);
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
