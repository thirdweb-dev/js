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
  SignerWithRestrictions,
  SignerWithRestrictionsBatchInput,
  SmartContract,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";



/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Get all wallets
 *
 * @example
 * ```javascript
 * const { data: smartWallets, isLoading, error } = useSmartWalletSigners(contract);
 * ```
 *
 * @param contract - an instance of a smart wallet
 * @returns a response object that includes an array of all signers of the provided smart wallet
 * @twfeature SmartWallet
 * @see {@link https://portal.thirdweb.com/react/react.usesmartwalletsigners?utm_source=sdk | Documentation}
 * @beta
 */
export function useSmartWalletSigners(
  contract: RequiredParam<SmartContract>
): UseQueryResult<SignerWithRestrictions[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.smartWallet.signers(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.smartWallet.getSignersWithRestrictions,
        "Contract instance does not support contract.smartWallet.getSignersWithRestrictions",
      );
      return contract.smartWallet.getSignersWithRestrictions();
    },
    { enabled: !!contract },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/
/**
 * Set the wallet's entire snapshot of permissions
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: setSmartWalletSigners,
 *     isLoading,
 *     error,
 *   } = useSetSmartWalletSigners(contract);
 *
 *   if (error) {
 *     console.error("failed to set smart wallet signers", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => setSmartWalletSigners("0x...")}
 *     >
 *       Set Smart Wallet Signers
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a smart wallet contract
 * @returns a mutation object that can be used to set the smart wallet signers
 * @twfeature SmartWallet
 * @see {@link https://portal.thirdweb.com/react/react.usesetsmartwalletsigners?utm_source=sdk | Documentation}
 * @beta
 */
export function useSetSmartWalletSigners(
  contract: RequiredParam<SmartContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (permissionsSnapshot: SignerWithRestrictionsBatchInput) => {
      requiredParamInvariant(contract, "contract is undefined");

      return contract.smartWallet.setAccess(permissionsSnapshot);
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
