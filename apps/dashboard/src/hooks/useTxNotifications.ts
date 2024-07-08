import { useToast } from "@chakra-ui/react";
import type { NFTContract, TokenContract } from "@thirdweb-dev/react";
import type {
  Erc20,
  Erc721,
  Erc1155,
  SmartContract,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { useErrorHandler } from "contexts/error-handler";
import { useCallback } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useInvalidateContractQuery } from "thirdweb/react";

export function useTxNotifications(
  successMessage: string,
  errorMessage: string,
  contract?: // v4 types
    | SmartContract
    | NFTContract
    | TokenContract
    | Erc1155
    | Erc721
    | Erc20
    | ValidContractInstance
    | undefined
    // v5...
    | ThirdwebContract
    | null,
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
      if ("getAddress" in contract) {
        // v4 contract
        invalidateContractQuery({
          chainId: contract.chainId,
          contractAddress: contract.getAddress(),
        });
      } else {
        // v5 contract
        invalidateContractQuery({
          chainId: contract.chain.id,
          contractAddress: contract.address,
        });
      }
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
