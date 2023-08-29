import type { Chain } from "@paperxyz/sdk-common-utilities";
import type { ClientIdWithQuerierAndChainType } from "../../interfaces/EmbeddedWallets/EmbeddedWallets";
import type {
  WalletHoldingInputType,
  WalletHoldingNftsReturnType,
} from "../../interfaces/EmbeddedWallets/WalletHoldings";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

export type WalletHoldingQueryTypes = {
  listNfts: WalletHoldingInputType;
  listTokens: WalletHoldingInputType;
};

/**
 * @description WalletHoldings responsible for all the read related methods that the developers might want to do with EmbeddedWallet
 */
export class WalletHoldings {
  protected chain: Chain;
  protected walletHoldingQuerier: EmbeddedWalletIframeCommunicator<WalletHoldingQueryTypes>;

  constructor({
    chain,
    querier,
  }: Omit<ClientIdWithQuerierAndChainType, "clientId">) {
    this.chain = chain;
    this.walletHoldingQuerier = querier;
  }
  // TODO: limit and offset are not currently being respected because they are not supported by simple-hash
  async listNfts({ chain, limit, offset }: WalletHoldingInputType) {
    return this.walletHoldingQuerier.call<WalletHoldingNftsReturnType>({
      procedureName: "listNfts",
      params: {
        chain,
        limit,
        offset,
      },
    });
  }
  // TODO: Support listing tokens
  // ? What tokens do we want to support?
  // async listTokens({ chain, limit, offset }: WalletHoldingInputType) {
  //   return this.walletHoldingQuerier.call<WalletHoldingTokensReturnType>(
  //     "listTokens",
  //     {
  //       chain,
  //       limit,
  //       offset,
  //     }
  //   );
  // }
}
