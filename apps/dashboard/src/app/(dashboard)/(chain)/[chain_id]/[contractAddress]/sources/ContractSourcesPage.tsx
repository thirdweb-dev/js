"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useResolveContractAbi } from "@3rdweb-sdk/react/hooks/useResolveContractAbi";
import {
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import { useContractSources } from "contract-ui/hooks/useContractSources";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";

interface ContractSourcesPageProps {
  contract: ThirdwebContract;
}

interface VerificationResult {
  explorerUrl: string;
  success: boolean;
  alreadyVerified: boolean;
  error?: string;
}

export async function verifyContract(contract: ThirdwebContract) {
  try {
    const response = await fetch(
      "https://contract.thirdweb.com/verify/contract",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress: contract.address,
          chainId: contract.chain.id,
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

interface ConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ThirdwebContract;
}

const VerifyContractModal: React.FC<
  ConnectorModalProps & { resetSignal: number }
> = ({ isOpen, onClose, contract, resetSignal }) => {
  const veryifyQuery = useQuery({
    queryKey: [
      "verify-contract",
      contract.chain.id,
      contract.address,
      resetSignal,
    ],
    queryFn: () => verifyContract(contract),
    enabled: isOpen,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        className="!bg-background rounded-lg border border-border"
        pb={2}
        mx={{ base: 4, md: 0 }}
      >
        <ModalHeader>
          <Flex gap={2} align="center">
            <Heading size="subtitle.md">Contract Verification</Heading>
            <Badge>beta</Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton mt={2} />
        <Divider mb={4} />
        <ModalBody py={4}>
          <Flex flexDir="column">
            {veryifyQuery.isPending && (
              <Flex gap={2} align="center">
                <Spinner color="purple.500" size="sm" />
                <Heading size="label.md">Verifying...</Heading>
              </Flex>
            )}
            {veryifyQuery?.error ? (
              <Flex gap={2} align="center">
                <CircleXIcon className="size-4 text-red-600" />
                <Heading size="label.md">
                  {veryifyQuery?.error.toString()}
                </Heading>
              </Flex>
            ) : null}

            {veryifyQuery.data?.results
              ? veryifyQuery.data?.results.map(
                  (result: VerificationResult, index: number) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    <Flex key={index} gap={2} align="center" mb={4}>
                      {result.success && (
                        <>
                          <CircleCheckIcon className="size-4 text-green-600" />
                          {result.alreadyVerified && (
                            <Heading size="label.md">
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
                          <CircleXIcon className="size-4 text-red-600" />
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
  contract,
}) => {
  const [resetSignal, setResetSignal] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = () => {
    onClose();
    // Increment to reset the query in the child component
    setResetSignal((prev: number) => prev + 1);
  };

  const contractSourcesQuery = useContractSources(contract);
  const abiQuery = useResolveContractAbi(contract);

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

  if (!contractSourcesQuery || contractSourcesQuery?.isPending) {
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
        contract={contract}
        resetSignal={resetSignal}
      />

      <Flex direction="column" gap={8}>
        <Flex direction="row" alignItems="center" gap={2}>
          <Heading size="title.sm" flex={1}>
            Sources
          </Heading>
          <RefreshContractMetadataButton
            chainId={contract.chain.id}
            contractAddress={contract.address}
          />
          <Button variant="primary" onClick={onOpen}>
            Verify contract
          </Button>
        </Flex>
        <Card>
          <SourcesPanel sources={sources} abi={abiQuery.data} />
        </Card>
      </Flex>
    </>
  );
};

function RefreshContractMetadataButton(props: {
  chainId: number;
  contractAddress: string;
}) {
  const router = useDashboardRouter();
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
      disabled={contractCacheMutation.isPending}
      variant="outline"
      onClick={() => {
        toast.promise(contractCacheMutation.mutateAsync(), {
          duration: 5000,
          loading: "Refreshing contract data...",
          success: () => "Contract data refreshed!",
          error: (e) => e?.message || "Failed to refresh contract data.",
        });
      }}
      className="w-[182px]"
    >
      {contractCacheMutation.isPending ? <Spinner /> : "Refresh Contract Data"}
    </Button>
  );
}
