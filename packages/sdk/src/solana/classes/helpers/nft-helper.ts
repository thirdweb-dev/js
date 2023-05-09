import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import {
  QueryAllParams,
  QueryAllParamsSchema,
} from "../../../core/schema/QueryParams";
import { NFT } from "../../../core/schema/nft";
import {
  CANDYMACHINE_PROGRAM_ID,
  METAPLEX_PROGRAM_ID,
} from "../../constants/addresses";
import { TransactionResult } from "../../types/common";
import { CreatorOutput } from "../../types/programs";
import { parseCreators } from "./creators-helper";
import {
  findMasterEditionV2Pda,
  GmaBuilder,
  JsonMetadata,
  Metadata,
  Metaplex,
  Mint,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
  token,
  toMetadata,
  toMetadataAccount,
  toNftOriginalEdition,
  toOriginalEditionAccount,
} from "@metaplex-foundation/js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import {
  ConfirmedSignatureInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
  SignaturesForAddressOptions,
  TransactionResponse,
} from "@solana/web3.js";
import BN from "bn.js";

/**
 * @internal
 */
export class NFTHelper {
  private metaplex: Metaplex;
  private connection: Connection;

  constructor(metaplex: Metaplex) {
    this.metaplex = metaplex;
    this.connection = metaplex.connection;
  }

  async getRaw(nftAddress: string) {
    return await this.metaplex.nfts().findByMint({
      mintAddress: new PublicKey(nftAddress),
    });
  }

  async get(nftAddress: string): Promise<NFT> {
    const meta = await this.getRaw(nftAddress);
    return await this.toNFTMetadata(meta);
  }

  async transfer(
    receiverAddress: string,
    nftAddress: string,
    quantity: number = 1,
  ): Promise<TransactionResult> {
    const result = await this.metaplex.nfts().transfer({
      nftOrSft: {
        address: new PublicKey(nftAddress),
        tokenStandard: TokenStandard.NonFungible,
      },
      toOwner: new PublicKey(receiverAddress),
      amount: token(quantity, 0),
    });

    return {
      signature: result.response.signature,
    };
  }

  async creatorsOf(nftAddress: string): Promise<CreatorOutput[]> {
    const meta = await this.getRaw(nftAddress);
    return parseCreators(meta.creators);
  }

  async balanceOf(walletAddress: string, nftAddress: string): Promise<number> {
    const address = await getAssociatedTokenAddress(
      new PublicKey(nftAddress),
      new PublicKey(walletAddress),
    );

    try {
      const account = await getAccount(this.connection, address);
      return Number(account.amount);
    } catch (e) {
      return 0;
    }
  }

  async ownerOf(nftAddress: string): Promise<string | undefined> {
    try {
      const largestAccounts = await this.connection.getTokenLargestAccounts(
        new PublicKey(nftAddress),
      );
      const largestAccountInfo = await this.connection.getParsedAccountInfo(
        largestAccounts.value[0].address,
      );
      const parsedData = largestAccountInfo?.value?.data as ParsedAccountData;
      const owner = parsedData ? parsedData.parsed.info.owner : undefined;
      return owner;
    } catch (err) {
      return undefined;
    }
  }

  async supplyOf(nftAddress: string): Promise<string> {
    let originalEdition;

    const originalEditionAccount = await this.metaplex
      .rpc()
      .getAccount(findMasterEditionV2Pda(new PublicKey(nftAddress)));

    if (originalEditionAccount.exists) {
      originalEdition = toNftOriginalEdition(
        toOriginalEditionAccount(originalEditionAccount),
      );
    } else {
      return "0";
    }

    // Add one to supply to account for the master edition
    return originalEdition.supply.add(new BN(1)).toString();
  }

  async totalSupply(collectionAddress: string): Promise<number> {
    const metadataAddresses = await this.getAllMetadataAddresses(
      collectionAddress,
    );
    return metadataAddresses.length;
  }

  async getAll(
    collectionAddress: string,
    queryParams?: QueryAllParams,
  ): Promise<NFT[]> {
    const { start, count } = QueryAllParamsSchema.parse(queryParams);

    const metadataAddresses = await this.getAllMetadataAddresses(
      collectionAddress,
    );

    // Metaplex GmaBuilder has a weird thing where they always start at 1 not 0
    // so we workaround it by adding an extra address, and shifting the count to get the actual count we want
    const fixedMetadataAddresses = (
      start === 0 ? [PublicKey.default] : []
    ).concat(metadataAddresses);
    const metadataInfos = await GmaBuilder.make(
      this.metaplex,
      fixedMetadataAddresses,
    ).getBetween(start, start === 0 ? count + 1 : start + count);

    // Parse each account into a metadata account
    const metadataParsed: Metadata<JsonMetadata<string>>[] = [];
    for (const metadataInfo of metadataInfos) {
      if (metadataInfo.exists) {
        try {
          metadataParsed.push(toMetadata(toMetadataAccount(metadataInfo)));
        } catch (error) {
          // no-op
        }
      }
    }

    // Finally, fetch the metadata + mint for each in parallel
    const nfts = await Promise.all(
      metadataParsed.map((m) => this.toNFTMetadata(m)),
    );
    return nfts;
  }

  async getTransactions(
    collectionAddress: string,
    options?: SignaturesForAddressOptions,
  ): Promise<TransactionResponse[]> {
    const collectionKey = new PublicKey(collectionAddress);
    // TODO cache signatures <> transactions mapping in memory so pagination doesn't re-request this everytime
    const allSignatures: ConfirmedSignatureInfo[] = [];

    if (options) {
      // only fetch the specified options
      allSignatures.push(
        ...(await this.metaplex.connection.getSignaturesForAddress(
          collectionKey,
          options,
        )),
      );
    } else {
      // fetch everything
      // This returns the first 1000, so we need to loop through until we run out of signatures to get.
      let signatures = await this.metaplex.connection.getSignaturesForAddress(
        collectionKey,
      );

      allSignatures.push(...signatures);
      do {
        signatures = await this.metaplex.connection.getSignaturesForAddress(
          collectionKey,
          {
            before: signatures[signatures.length - 1]?.signature,
          },
        );
        allSignatures.push(...signatures);
      } while (signatures.length > 0);
    }

    let txns: TransactionResponse[] = [];
    // TODO RPC's will throttle this, need to do some optimizations here
    const batchSize = 1000; // alchemy RPC batch limit
    for (let i = 0; i < allSignatures.length; i += batchSize) {
      const batch = allSignatures.slice(
        i,
        Math.min(allSignatures.length, i + batchSize),
      );

      txns = [
        ...txns,
        ...((
          await this.metaplex.connection.getTransactions(
            batch.map((s) => s.signature),
          )
        ).filter((tx) => !!tx) as TransactionResponse[]),
      ];
    }
    return txns;
  }

  async getAllMetadataAddresses(
    collectionAddress: string,
  ): Promise<PublicKey[]> {
    const txns = (await this.getTransactions(collectionAddress)).reverse();

    return txns
      .map((tx) => {
        if (tx) {
          const programIds = tx.transaction.message
            .programIds()
            .map((p) => p.toString());
          const accountKeys = tx.transaction.message.accountKeys.map((p) =>
            p.toString(),
          );
          // Only look in transactions that call the Metaplex token metadata program
          if (programIds.includes(METAPLEX_PROGRAM_ID)) {
            // Go through all instructions in a given transaction
            for (const ix of tx.transaction.message.instructions) {
              // Filter for setAndVerify or verify instructions in the Metaplex token metadata program
              if (
                (ix.data === "K" || ix.data === "S" || ix.data === "X") &&
                accountKeys[ix.programIdIndex] === METAPLEX_PROGRAM_ID
              ) {
                const metadataAddressIndex = ix.accounts[0];

                return tx.transaction.message.accountKeys[metadataAddressIndex];
              }
            }
          } else if (programIds.includes(CANDYMACHINE_PROGRAM_ID)) {
            for (const ix of tx.transaction.message.instructions) {
              // filter for SetCollectionDuringMint from CandyMachineV2
              if (
                accountKeys[ix.programIdIndex] === CANDYMACHINE_PROGRAM_ID &&
                ix.data === "JEuNFGs7wrU"
              ) {
                const metadataAddressIndex = ix.accounts[1];

                return tx.transaction.message.accountKeys[metadataAddressIndex];
              }
            }
          }
        }
      })
      .filter((a) => !!a) as PublicKey[];
  }

  async toNFTMetadata(
    meta:
      | Nft
      | Sft
      | NftWithToken
      | SftWithToken
      | Metadata<JsonMetadata<string>>,
  ): Promise<NFT> {
    let mint = "mint" in meta ? meta.mint : undefined;
    let fullModel = meta;
    if (meta.model === "metadata") {
      fullModel = await this.getRaw(meta.mintAddress.toBase58());
      mint = fullModel.mint;
    }
    if (!mint) {
      throw new Error("No mint found for NFT");
    }
    const [owner, supply] = await Promise.all([
      this.ownerOf(mint.address.toBase58()),
      this.supplyOf(mint.address.toBase58()),
    ]);
    return this.toNFTMetadataResolved(mint, owner, supply, fullModel);
  }

  private async toNFTMetadataResolved(
    mint: Mint,
    owner: string | undefined,
    supply: string,
    fullModel:
      | Nft
      | Sft
      | NftWithToken
      | SftWithToken
      | Metadata<JsonMetadata<string>>,
  ): Promise<NFT> {
    return {
      metadata: {
        id: mint.address.toBase58(),
        uri: fullModel.uri,
        name: fullModel.name,
        symbol: fullModel.symbol,
        ...fullModel.json,
      },
      owner: owner || PublicKey.default.toBase58(),
      supply,
      type: "metaplex",
    };
  }
}
