import { useToast } from "@chakra-ui/react";
import { useErrorHandler } from "contexts/error-handler";
import { useCallback } from "react";

export function useTxNotifications(
  successMessage: string,
  errorMessage: string,
) {
  const toast = useToast();
  const { onError } = useErrorHandler();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage]);

  const _onError = useCallback(
    (error: unknown) => {
      onError(error, errorMessage);
    },
    [errorMessage, onError],
  );

  return { onSuccess, onError: _onError };
}
