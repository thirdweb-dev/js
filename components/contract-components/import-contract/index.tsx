import { useDashboardNetwork } from "@3rdweb-sdk/react";
import { useImportContract } from "@3rdweb-sdk/react/hooks/useImportContract";
import { Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Button, Heading, Text } from "tw-components";

interface ImportContractProps {
  contractAddress: string;
}

export const ImportContract: React.FC<ImportContractProps> = ({
  contractAddress,
}) => {
  const trackEvent = useTrack();
  const network = useDashboardNetwork();
  const importContract = useImportContract();

  const { onSuccess, onError } = useTxNotifications(
    "Contract imported successfully",
    "Failed to import contract",
  );

  return (
    <Flex
      direction="column"
      gap={8}
      w="full"
      alignItems="center"
      mt={{ base: 4, md: 12 }}
    >
      <Flex direction="column" gap={6} w={96}>
        <Heading size="title.sm" textAlign="center">
          This contract can&apos;t be found on thirdweb
        </Heading>
        <Text textAlign="center">
          Import this contract and unlock thirdweb&apos;s toolkit
        </Text>
        <Flex justifyContent="center">
          <Button
            colorScheme="purple"
            onClick={() => {
              trackEvent({
                category: "import-contract",
                action: "click",
                label: "attempt",
                contractAddress,
                network,
              });
              importContract.mutate(contractAddress, {
                onSuccess: () => {
                  trackEvent({
                    category: "import-contract",
                    action: "click",
                    label: "success",
                    contractAddress,
                    network,
                  });
                  onSuccess();
                  window.location.reload();
                },
                onError: (error) => {
                  trackEvent({
                    category: "import-contract",
                    action: "click",
                    label: "error",
                    error,
                    contractAddress,
                    network,
                  });
                  onError(error);
                },
              });
            }}
            isLoading={importContract.isLoading}
            w="auto"
          >
            Import Contract
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
