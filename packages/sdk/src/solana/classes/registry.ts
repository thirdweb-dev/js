import { TWREGISTRY_PROGRAM_ID } from "../constants/addresses";
import TWRegistryIDL from "../idl/tw_registry.json";
import { Program } from "../programs/program";
import { ProgramType } from "../programs/types";
import { WalletAccount } from "../types/common";
import { RegisteredProgram } from "../types/programs";
import { UserWallet } from "./user-wallet";
import {
  CandyMachine,
  InstructionWithSigners,
  Metadata,
  Metaplex,
  Pda,
  TokenProgram,
} from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import type { BN, Idl } from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Buffer } from "buffer/";

/**
 * @internal
 */
export class Registry {
  private metaplex: Metaplex;
  private twRegistry: Program;

  constructor(metaplex: Metaplex, userWallet: UserWallet) {
    this.metaplex = metaplex;
    this.twRegistry = new Program(
      TWREGISTRY_PROGRAM_ID,
      TWRegistryIDL as Idl,
      this.metaplex.connection,
      userWallet,
    );
  }

  public async getProgramType(address: string) {
    try {
      const candyMachine = await this.metaplex
        .candyMachines()
        .findByAddress({ address: new PublicKey(address) })
        .run();
      if (candyMachine) {
        return "nft-drop";
      }
    } catch (err) {
      // ignore and try next
    }
    const metadata = await this.metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(address) })
      .run();

    if (metadata) {
      if (metadata.collectionDetails) {
        return "nft-collection";
      } else {
        if (metadata.tokenStandard === TokenStandard.Fungible) {
          return "token";
        }
      }
    }
    throw new Error("Unknown account type");
  }

  public async getDeployedPrograms(
    walletAddress: string,
  ): Promise<RegisteredProgram[]> {
    const wallet = new PublicKey(walletAddress);
    const count = await this.getTotalProgramsRegistered(wallet);
    const programAddresses = [];
    for (let i = 0; i < count; i++) {
      programAddresses.push(
        this.getRegisteredProgramAddress(wallet, i).toBase58(),
      );
    }
    const programsRaw = await this.twRegistry.fetchMultiple(
      "registeredProgramAccount",
      programAddresses,
    );
    return programsRaw.map((raw) => this.toRegisteredProgram(raw));
  }

  public async getTotalProgramsRegistered(wallet: PublicKey) {
    const accountExists = await this.registrarAccountExists(wallet);
    if (!accountExists) {
      return 0;
    }
    const registrarPda = this.getRegistrarAddress(wallet);
    const data = await this.twRegistry.fetch(
      "registrarAccount",
      registrarPda.toBase58(),
    );
    return (data.count as BN).toNumber();
  }

  public async getProgramAt(
    walletAddress: string,
    index: number,
  ): Promise<RegisteredProgram> {
    const wallet = new PublicKey(walletAddress);
    const pda = this.getRegisteredProgramAddress(wallet, index);
    const data = await this.twRegistry.fetch(
      "registeredProgramAccount",
      pda.toBase58(),
    );
    return this.toRegisteredProgram(data);
  }

  public getRegistrarAddress(wallet: PublicKey) {
    return Pda.find(new PublicKey(TWREGISTRY_PROGRAM_ID), [
      Buffer.from("registrar", "utf8"),
      wallet.toBuffer(),
    ]);
  }

  public getRegisteredProgramAddress(wallet: PublicKey, index: number) {
    return Pda.find(new PublicKey(TWREGISTRY_PROGRAM_ID), [
      Buffer.from("registered_program"),
      wallet.toBuffer(),
      Buffer.from(index.toString()),
    ]);
  }

  /**
   * @internal
   */
  public async getAddToRegistryInstructions(
    programToAdd: PublicKey,
    programName: string,
    programType: ProgramType,
  ) {
    const wallet = this.metaplex.identity().publicKey;
    const instructions: InstructionWithSigners[] = [];
    const registrarAccountExists = await this.registrarAccountExists(wallet);
    if (!registrarAccountExists) {
      instructions.push({
        instruction: (await this.getInitializeRegistrarTransaction(wallet))
          .instructions[0],
        signers: [this.metaplex.identity()],
      });
    }
    instructions.push({
      instruction: (
        await this.getRegisterProgramTransaction(
          wallet,
          programToAdd,
          programName,
          programType,
        )
      ).instructions[0],
      signers: [this.metaplex.identity()],
    });
    return instructions;
  }

  private async getInitializeRegistrarTransaction(
    wallet: PublicKey,
  ): Promise<Transaction> {
    const registrarPda = this.getRegistrarAddress(wallet);
    return this.twRegistry
      .prepareCall("initializeRegistrar", {
        accounts: {
          authority: wallet.toBase58(),
          registrarAccount: registrarPda.toBase58(),
        },
      })
      .transaction();
  }

  private async getRegisterProgramTransaction(
    wallet: PublicKey,
    programAddress: PublicKey,
    programName: string,
    programType: string,
  ): Promise<Transaction> {
    const registrarPda = this.getRegistrarAddress(wallet);
    const registeredProgramAddress = this.getRegisteredProgramAddress(
      wallet,
      await this.getTotalProgramsRegistered(wallet),
    );
    return this.twRegistry
      .prepareCall("register", {
        accounts: {
          authority: wallet.toBase58(),
          registrarAccount: registrarPda.toBase58(),
          registeredProgramAccount: registeredProgramAddress.toBase58(),
        },
        data: [programAddress, programName, programType],
      })
      .transaction();
  }

  private async registrarAccountExists(wallet: PublicKey) {
    const registrarPda = this.getRegistrarAddress(wallet);
    const account = await this.metaplex.rpc().getAccount(registrarPda);
    return account.exists;
  }

  private getDropForCollection(candyMachines: CandyMachine[], meta: Metadata) {
    return candyMachines.find(
      (candyMachine) =>
        candyMachine.collectionMintAddress?.toBase58() ===
        meta.mintAddress.toBase58(),
    );
  }

  // TODO probably don't need this anymore, rely on registry instead
  private async getOwnedTokenAccounts(
    walletAddress: string,
  ): Promise<WalletAccount[]> {
    const mints = await this.getOwnedTokenAddreses(walletAddress);
    const metadatas = await this.metaplex
      .nfts()
      .findAllByMintList({ mints })
      .run();

    const candyMachines = await this.metaplex
      .candyMachines()
      .findAllBy({
        type: "authority",
        publicKey: new PublicKey(walletAddress),
      })
      .run();

    return metadatas
      .map((mintMetadata) => {
        const meta = mintMetadata as Metadata;
        if (!meta) {
          return undefined;
        }
        if (meta?.collectionDetails) {
          // check if it's part of a candy machine
          const drop = this.getDropForCollection(candyMachines, meta);
          if (drop) {
            return {
              type: "nft-drop",
              address: drop.address.toBase58(),
              name: meta.name,
            };
          } else {
            return {
              type: "nft-collection",
              address: meta.mintAddress.toBase58(),
              name: meta.name,
            };
          }
        } else {
          if (meta.tokenStandard === TokenStandard.Fungible) {
            return {
              type: "token",
              address: meta.mintAddress.toBase58(),
              name: meta.name,
            };
          }
        }
      })
      .filter((account) => account !== undefined) as WalletAccount[];
  }

  private async getOwnedTokenAddreses(walletAddress: string) {
    return await TokenProgram.tokenAccounts(this.metaplex)
      .selectMint()
      .whereOwner(new PublicKey(walletAddress))
      .getDataAsPublicKeys();
  }

  private toRegisteredProgram(
    data: Record<string, unknown>,
  ): RegisteredProgram {
    return {
      deployer: (data.authority as PublicKey).toBase58(),
      programAddress: (data.programAddress as PublicKey).toBase58(),
      programName: (data.programName as string).toString(),
      programType: (data.programType as string).toString(),
      visible: data.visible as boolean,
    };
  }
}
