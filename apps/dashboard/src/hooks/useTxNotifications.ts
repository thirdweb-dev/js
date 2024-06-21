import { useToast } from "@chakra-ui/react";
import { useErrorHandler } from "contexts/error-handler";
import { useCallback } from "react";
import { useInvalidateContractQuery } from "thirdweb/react";

export function useTxNotifications(
  successMessage: string,
  errorMessage: string,
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  contract?: any,
) {
  const toast = useToast();
  const { onError } = useErrorHandler();
  const invalidateContractQuery = useInvalidateContractQuery();

  const onSuccess = useCallback(() => {
    toast({
      position: "bottom",
      variant: "solid",
      title: "Success",
      description: successMessage,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    if (contract) {
      invalidateContractQuery({
        chainId: contract.chainId,
        contractAddress: contract.getAddress(),
      });
    }
  }, [successMessage, contract, invalidateContractQuery, toast]);

  const _onError = useCallback(
    (error: unknown) => {
      onError(error, errorMessage);
    },
    [errorMessage, onError],
  );

  return { onSuccess, onError: _onError };
}
