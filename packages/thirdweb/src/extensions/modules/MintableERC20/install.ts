import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { Address } from "../../../utils/address.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  type EncodeBytesOnInstallParams,
  encodeBytesOnInstallParams,
} from "../__generated__/ClaimableERC20/encode/encodeBytesOnInstall.js";
import { getOrDeployModule } from "../common/getOrDeployModule.js";
import { installPublishedModule } from "../common/installPublishedModule.js";

// TODO (modular): generate this

const contractId = "MintableERC20";

export function module(params: EncodeBytesOnInstallParams) {
  return async (args: {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
  }) => {
    // deploys if needed
    const moduleContract = await getOrDeployModule({
      account: args.account,
      chain: args.chain,
      client: args.client,
      contractId,
    });
    return {
      module: moduleContract.address as Address,
      data: encodeInstall(params),
    };
  };
}

export function install(options: {
  contract: ThirdwebContract;
  account: Account;
  params: EncodeBytesOnInstallParams;
}): PreparedTransaction {
  return installPublishedModule({
    account: options.account,
    contract: options.contract,
    moduleName: contractId,
    moduleData: encodeInstall(options.params),
  });
}

export const encodeInstall = encodeBytesOnInstallParams;
