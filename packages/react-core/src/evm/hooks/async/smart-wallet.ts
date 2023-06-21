import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../../providers/thirdweb-sdk-provider";
import { WalletAddress } from "../../types";
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
  SignerWithRestrictions, SmartContract,
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

/**
 * Check if a smart wallet has been deployed for the given admin
 *
 * @example
 * ```javascript
 * const { data: isSmartWalletDeployed, isLoading, error } = useIsSmartWalletDeployed(contract);
 * ```
 *
 * @param contract - an instance of a smart wallet factory contract
 * @returns a boolean indicating if a smart wallet has been deployed for the given admin
 * @twfeature SmartWalletFactory
 * @see {@link https://portal.thirdweb.com/react/react.useissmartwalletdeployed?utm_source=sdk | Documentation}
 * @beta
 */
export function useIsSmartWalletDeployed(
  contract: RequiredParam<SmartContract>,
  admin: RequiredParam<WalletAddress>,
  extraData?: BytesLike,
): UseQueryResult<boolean> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.smartWalletFactory.isSmartWalletDeployed(contractAddress, admin),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.smartWalletFactory.isWalletDeployed,
        "Contract instance does not support contract.smartWalletFactory.getAllWallets",
      );
      invariant(admin, "No wallet address provided");
      return contract.smartWalletFactory.isWalletDeployed(admin, extraData);
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
