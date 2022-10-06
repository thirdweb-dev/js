import { TWREGISTRY_PROGRAM_ID } from "../constants/addresses";
import TWRegistryIDL from "../idl/tw_registry.json";
import { Program } from "../programs/program";
import { WalletAccount } from "../types/common";
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
import type { Idl } from "@project-serum/anchor";
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

  public async registrarAccountExists(wallet: PublicKey) {
    const registrarPda = this.getRegistrarAddress(wallet);
    const account = await this.metaplex.rpc().getAccount(registrarPda);
    return account.exists;
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
    return data.count as number;
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

  public async getAddToRegistryInstructions(
    programToAdd: PublicKey,
    programType: string,
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
          "nft-collection",
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
    programType: string,
  ): Promise<Transaction> {
    const registrarPda = this.getRegistrarAddress(wallet);
    const registeredProgramAddress = this.getRegisteredProgramAddress(
      wallet,
      await this.getTotalProgramsRegistered(wallet),
    );
    const accounts = {
      authority: wallet.toBase58(),
      registrarAccount: registrarPda.toBase58(),
      registeredProgramAccount: registeredProgramAddress.toBase58(),
    };
    console.log(accounts);
    return this.twRegistry
      .prepareCall("register", {
        accounts,
        data: [programAddress, programType],
      })
      .transaction();
  }

  public async getAccountType(address: string) {
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

  public async getAccountsForWallet(
    walletAddress: string,
  ): Promise<WalletAccount[]> {
    const mints = await this.getOwnedTokenAccountsForWallet(walletAddress);
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

  private getDropForCollection(candyMachines: CandyMachine[], meta: Metadata) {
    return candyMachines.find(
      (candyMachine) =>
        candyMachine.collectionMintAddress?.toBase58() ===
        meta.mintAddress.toBase58(),
    );
  }

  private async getOwnedTokenAccountsForWallet(walletAddress: string) {
    return await TokenProgram.tokenAccounts(this.metaplex)
      .selectMint()
      .whereOwner(new PublicKey(walletAddress))
      .getDataAsPublicKeys();
  }
}
