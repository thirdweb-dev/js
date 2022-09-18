import { TransactionResult } from "../types/common";
import {
  NFTDropConditionsOutputSchema,
  NFTDropMetadataInput,
} from "../types/contracts/nft-drop";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

export class ClaimConditions {
  private dropMintAddress: PublicKey;
  private metaplex: Metaplex;

  constructor(dropMintAddress: string, metaplex: Metaplex) {
    this.dropMintAddress = new PublicKey(dropMintAddress);
    this.metaplex = metaplex;
  }

  async get(): Promise<NFTDropMetadataInput> {
    const candyMachine = await this.getCandyMachine();

    return {
      price: candyMachine.price.basisPoints.toNumber(),
      sellerFeeBasisPoints: candyMachine.sellerFeeBasisPoints,
      itemsAvailable: candyMachine.itemsAvailable.toNumber(),
      goLiveDate: candyMachine.goLiveDate
        ? new Date(candyMachine.goLiveDate.toNumber() * 1000)
        : undefined,
    };
  }

  async set(metadata: NFTDropMetadataInput): Promise<TransactionResult> {
    const parsed = NFTDropConditionsOutputSchema.parse(metadata);

    const result = await this.metaplex
      .candyMachines()
      .update({
        candyMachine: await this.getCandyMachine(),
        ...parsed,
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  private async getCandyMachine() {
    return this.metaplex
      .candyMachines()
      .findByAddress({ address: this.dropMintAddress })
      .run(); // TODO abstract return types away
  }
}
