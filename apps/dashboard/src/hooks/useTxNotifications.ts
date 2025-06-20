import { useErrorHandler } from "contexts/error-handler";
import { useCallback } from "react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { useInvalidateContractQuery } from "thirdweb/react";

export function useTxNotifications(
  successMessage: string,
  errorMessage: string,
  contract?: ThirdwebContract | null,
) {
  const { onError } = useErrorHandler();
  const invalidateContractQuery = useInvalidateContractQuery();

  const onSuccess = useCallback(() => {
    toast.success(successMessage);
    if (contract) {
      invalidateContractQuery({
        chainId: contract.chain.id,
        contractAddress: contract.address,
      });
    }
  }, [successMessage, contract, invalidateContractQuery]);

  const _onError = useCallback(
    (error: unknown) => {
      onError(error, errorMessage);
    },
    [errorMessage, onError],
  );

  return { onError: _onError, onSuccess };
}
