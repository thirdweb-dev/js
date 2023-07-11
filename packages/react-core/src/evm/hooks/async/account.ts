import type { providers } from "ethers";
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
  UseMutationResult,
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
 * Get all accounts
 *
 * @example
 * ```javascript
 * const { data: accounts, isLoading, error } = useAccountSigners(contract);
 * ```
 *
 * @param contract - an instance of a account
 * @returns a response object that includes an array of all signers of the provided account
 * @twfeature Account
 * @see {@link https://portal.thirdweb.com/react/react.useaccountsigners?utm_source=sdk | Documentation}
 * @beta
 */
export function useAccountSigners(
  contract: RequiredParam<SmartContract>,
): UseQueryResult<SignerWithRestrictions[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.account.signers(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.account.getSignersWithRestrictions,
        "Contract instance does not support contract.account.getSignersWithRestrictions",
      );
      return contract.account.getSignersWithRestrictions();
    },
    { enabled: !!contract },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/
/**
 * Set the account's entire snapshot of permissions
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: setAccountSigners,
 *     isLoading,
 *     error,
 *   } = useSetAccountSigners(contract);
 *
 *   if (error) {
 *     console.error("failed to set account signers", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => setAccountSigners("0x...")}
 *     >
 *       Set Account Signers
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a account contract
 * @returns a mutation object that can be used to set the account signers
 * @twfeature Account
 * @see {@link https://portal.thirdweb.com/react/react.usesetaccountsigners?utm_source=sdk | Documentation}
 * @beta
 */
export function useSetAccountSigners(
  contract: RequiredParam<SmartContract>,
): UseMutationResult<
  { receipt: providers.TransactionReceipt },
  unknown,
  SignerWithRestrictionsBatchInput,
  unknown
> {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (permissionsSnapshot: SignerWithRestrictionsBatchInput) => {
      requiredParamInvariant(contract, "contract is undefined");

      return contract.account.setAccess(permissionsSnapshot);
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
