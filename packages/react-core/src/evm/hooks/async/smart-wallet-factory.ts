import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../../providers/thirdweb-sdk-provider";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import {
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  AccountEvent, SmartContract,
} from "@thirdweb-dev/sdk";
import type { BytesLike } from "ethers";
import invariant from "tiny-invariant";



/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Get all wallets
 *
 * @example
 * ```javascript
 * const { data: smartWallets, isLoading, error } = useSmartWallets(contract);
 * ```
 *
 * @param contract - an instance of a smart wallet factory contract
 * @returns a response object that includes an array of all smart wallets with their associated admin
 * @twfeature SmartWalletFactory
 * @see {@link https://portal.thirdweb.com/react/react.usesmartwallets?utm_source=sdk | Documentation}
 * @beta
 */
export function useSmartWallets(
  contract: RequiredParam<SmartContract>
): UseQueryResult<AccountEvent[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.smartWalletFactory.getAll(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.smartWalletFactory.getAllWallets,
        "Contract instance does not support contract.smartWalletFactory.getAllWallets",
      );
      return contract.smartWalletFactory.getAllWallets();
    },
    { enabled: !!contract },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/
/**
 * Create a smart wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: createSmartWallet,
 *     isLoading,
 *     error,
 *   } = useCreateSmartWallet(contract);
 *
 *   if (error) {
 *     console.error("failed to create smart wallet", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => createSmartWallet("0x...")}
 *     >
 *       Create Smart Wallet
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a smart wallet factory contract
 * @returns a mutation object that can be used to create a smart wallet
 * @twfeature SmartWalletFactory
 * @see {@link https://portal.thirdweb.com/react/react.usecreatesmartwallet?utm_source=sdk | Documentation}
 * @beta
 */
export function useCreateSmartWallet(
  contract: RequiredParam<SmartContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (admin: string, extraData?: BytesLike) => {
      requiredParamInvariant(contract, "contract is undefined");

      return contract.smartWalletFactory.createWallet(
        admin,
        extraData,
      );    
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}
