import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useQueryWithNetwork } from "@3rdweb-sdk/react/hooks/query/useQueryWithNetwork";
import {
  Divider,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContract } from "@thirdweb-dev/react";
import type { Abi } from "@thirdweb-dev/sdk";
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import { useContractSources } from "contract-ui/hooks/useContractSources";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "sonner";
import { Badge, Button, Card, Heading } from "tw-components";

interface ContractSourcesPageProps {
  contractAddress?: string;
}

type ContractParams = {
  contractAddress: string;
  chainId: number;
};

interface VerificationResult {
  explorerUrl: string;
  success: boolean;
  alreadyVerified: boolean;
  error?: string;
}

export async function verifyContract({
  contractAddress,
  chainId,
}: ContractParams) {
  try {
    const response = await fetch(
      "https://contract.thirdweb.com/verify/contract",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress,
          chainId,
        }),
      },
    );

    if (!response.ok) {
      console.error(`Error verifying contract: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error verifying contract: ${error}`);
  }
}

function useVerifyCall(
  shouldFetch: boolean,
  contractAddress: string,
  resetSignal: number,
) {
  const chainId = useDashboardEVMChainId();
  const queryKey = useMemo(
    () => ["verify", contractAddress, resetSignal],
    [contractAddress, resetSignal],
  );
  return useQueryWithNetwork(
    queryKey,
    () => (chainId ? verifyContract({ contractAddress, chainId }) : null),
    {
      enabled: !!contractAddress && !!chainId && shouldFetch,
    },
  );
}

interface ConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
}

const VerifyContractModal: React.FC<
  ConnectorModalProps & { resetSignal: number }
> = ({ isOpen, onClose, contractAddress, resetSignal }) => {
  const { data: verifyResult, isLoading: verifying } = useVerifyCall(
    isOpen,
    contractAddress,
    resetSignal,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb={2} mx={{ base: 4, md: 0 }}>
        <ModalHeader>
          <Flex gap={2} align="center">
            <Heading size="subtitle.md">Contract Verification</Heading>
            <Badge variant="outline" colorScheme="purple" rounded="md" px={2}>
              beta
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton mt={2} />
        <Divider mb={4} />
        <ModalBody py={4}>
          <Flex flexDir="column">
            {verifying && (
              <Flex gap={2} align="center">
                <Spinner color="purple.500" size="sm" />
                <Heading size="label.md">Verifying...</Heading>
              </Flex>
            )}
            {verifyResult?.error ? (
              <Flex gap={2} align="center">
                <Icon as={FiXCircle} color="red.600" />

                <Heading size="label.md">
                  {verifyResult?.error.toString()}
                </Heading>
              </Flex>
            ) : null}

            {verifyResult?.results
              ? verifyResult?.results.map(
                  (result: VerificationResult, index: number) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    <Flex key={index} gap={2} align="center" mb={4}>
                      {result.success && (
                        <>
                          <Icon as={FiCheckCircle} color="green.600" />
                          {result.alreadyVerified && (
                            <Heading size="label.md">
                              {" "}
                              {result.explorerUrl}: Already verified
                            </Heading>
                          )}
                          {!result.alreadyVerified && (
                            <Heading size="label.md">
                              {result.explorerUrl}: Verification successful
                            </Heading>
                          )}
                        </>
                      )}
                      {!result.success && (
                        <>
                          <Icon as={FiXCircle} color="red.600" />
                          <Heading size="label.md">
                            {`${result.explorerUrl}: Verification failed`}
                          </Heading>
                        </>
                      )}
                    </Flex>
                  ),
                )
              : null}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const ContractSourcesPage: React.FC<ContractSourcesPageProps> = ({
  contractAddress,
}) => {
  const [resetSignal, setResetSignal] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = () => {
    onClose();
    // Increment to reset the query in the child component
    setResetSignal((prev: number) => prev + 1);
  };

  const contractSourcesQuery = useContractSources(contractAddress);

  const { contract } = useContract(contractAddress);

  const abi = useMemo(() => contract?.abi as Abi, [contract]);

  // clean up the source filenames and filter out libraries
  const sources = useMemo(() => {
    if (!contractSourcesQuery.data) {
      return [];
    }
    return contractSourcesQuery.data
      .map((source) => {
        return {
          ...source,
          filename: source.filename.split("/").pop(),
        };
      })
      .slice()
      .reverse();
  }, [contractSourcesQuery.data]);

  if (!contractAddress || !contract) {
    return <div>No contract address provided</div>;
  }

  if (!contractSourcesQuery || contractSourcesQuery?.isLoading) {
    return (
      <Flex direction="row" align="center" gap={2}>
        <Spinner color="purple.500" size="xs" />
        <Heading size="title.sm">Loading...</Heading>
      </Flex>
    );
  }

  return (
    <>
      <VerifyContractModal
        isOpen={isOpen}
        onClose={() => handleClose()}
        contractAddress={contractAddress}
        resetSignal={resetSignal}
      />

      <Flex direction="column" gap={8}>
        <Flex direction="row" alignItems="center" gap={2}>
          <Heading size="title.sm" flex={1}>
            Sources
          </Heading>
          <RefreshContractMetadataButton
            chainId={contract.chainId}
            contractAddress={contract.getAddress()}
          />
          <Button variant="solid" colorScheme="purple" onClick={onOpen}>
            Verify contract
          </Button>
        </Flex>
        <Card p={0}>
          <SourcesPanel sources={sources} abi={abi} />
        </Card>
      </Flex>
    </>
  );
};

function RefreshContractMetadataButton(props: {
  chainId: number;
  contractAddress: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const contractCacheMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `https://contract.thirdweb.com/metadata/${props.chainId}/${props.contractAddress}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const errorMsg = await response.json();
        console.error(`Failed to purge contract cache: ${response.statusText}`);

        throw new Error(
          errorMsg.message ||
            errorMsg.error ||
            "Failed to refresh contract data.",
        );
      }
      // successful response
      return true;
    },
    onSuccess: async () => {
      // invalidate _all_ queries
      await queryClient.invalidateQueries();
      // refresh the page
      setTimeout(() => {
        router.refresh();
      }, 1000);
    },
  });

  return (
    <Button
      isLoading={contractCacheMutation.isLoading}
      variant="outline"
      onClick={() => {
        toast.promise(contractCacheMutation.mutateAsync(), {
          duration: 5000,
          loading: "Refreshing contract data...",
          success: () => "Contract data refreshed!",
          error: (e) => e?.message || "Failed to refresh contract data.",
        });
      }}
    >
      Refresh Contract Data
    </Button>
  );
}
