import { useActiveChainId } from "@3rdweb-sdk/react";
import { useQueryWithNetwork } from "@3rdweb-sdk/react/hooks/query/useQueryWithNetwork";
import { usePrebuiltSource } from "@3rdweb-sdk/react/hooks/usePrebuiltSource";
import {
  Divider,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import { Abi } from "components/contract-components/types";
import { useContractSources } from "contract-ui/hooks/useContractSources";
import { VerificationStatus, blockExplorerMap } from "pages/api/verify";
import { useMemo } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Badge, Button, Card, Heading, LinkButton } from "tw-components";

interface CustomContractSourcesPageProps {
  contractAddress?: string;
}

function useVerifyCall(shouldFetch: boolean, contractAddress?: string) {
  const chainId = useActiveChainId();
  return useQueryWithNetwork(
    ["verify", contractAddress],
    async () => {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress,
          chainId,
        }),
      });
      return response.json();
    },
    {
      enabled: !!contractAddress && !!chainId && shouldFetch,
    },
  );
}

function useCheckVerificationStatus(guid?: string) {
  const chainId = useActiveChainId();
  return useQueryWithNetwork(
    ["verifycheck", guid],
    async () => {
      const response = await fetch(
        `/api/checkVerificationStatus?guid=${guid}&chainId=${chainId}`,
      );
      return response.json();
    },
    {
      enabled: !!guid && !!chainId,
      refetchInterval: (data) => {
        if (data?.result === VerificationStatus.PENDING) {
          return 3000;
        }
        return 0;
      },
    },
  );
}

interface ConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
}

const VerifyContractModal: React.FC<ConnectorModalProps> = ({
  isOpen,
  onClose,
  contractAddress,
}) => {
  const { data: verifyResult, isLoading: verifying } = useVerifyCall(
    isOpen,
    contractAddress,
  );
  const { data: verificationStatus } = useCheckVerificationStatus(
    verifyResult?.guid,
  );
  const showLinkButton =
    verifyResult?.error === VerificationStatus.ALREADY_VERIFIED ||
    verificationStatus?.result === VerificationStatus.SUCCESS;
  const chainId = useActiveChainId();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb={2} mx={{ base: 4, md: 0 }}>
        <ModalHeader>
          <Flex gap={2} align="center">
            <Heading size="subtitle.md">Etherscan Verification</Heading>
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
                {verifyResult?.error === VerificationStatus.ALREADY_VERIFIED ? (
                  <Icon as={FiCheckCircle} color="green.600" />
                ) : (
                  <Icon as={FiXCircle} color="red.600" />
                )}
                <Heading size="label.md">
                  {verifyResult?.error.toString()}
                </Heading>
              </Flex>
            ) : null}
            {verificationStatus?.result ? (
              <Flex gap={2} align="center">
                {verificationStatus?.result === VerificationStatus.PENDING && (
                  <Spinner color="purple.500" size="sm" />
                )}
                {verificationStatus?.result === VerificationStatus.SUCCESS && (
                  <Icon as={FiCheckCircle} color="green.600" />
                )}
                {verificationStatus?.result === VerificationStatus.FAILED && (
                  <Icon as={FiXCircle} color="red.600" />
                )}
                <Heading size="label.md">
                  {verificationStatus.result.toString()}
                </Heading>
              </Flex>
            ) : null}
          </Flex>
        </ModalBody>
        <ModalFooter>
          {showLinkButton && (
            <LinkButton
              variant="outline"
              size="sm"
              href={blockExplorerUrl(chainId, contractAddress)}
              isExternal
            >
              View on {blockExplorerName(chainId)}
            </LinkButton>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CustomContractSourcesPage: React.FC<
  CustomContractSourcesPageProps
> = ({ contractAddress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contractQuery = useContractSources(contractAddress);
  const chainId = useActiveChainId();

  const { data: prebuiltSource } = usePrebuiltSource(contractAddress);
  const { contract } = useContract(contractAddress);

  const abi = useMemo(() => contract?.abi as Abi, [contract]);

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  if ((!contractQuery || contractQuery?.isLoading) && !prebuiltSource) {
    return (
      <Flex direction="row" align="center" gap={2}>
        <Spinner color="purple.500" size="xs" />
        <Heading size="title.sm">Loading...</Heading>
      </Flex>
    );
  }

  // clean up the source filenames and filter out libraries
  const sources = prebuiltSource
    ? [prebuiltSource]
    : contractQuery.data
    ? contractQuery.data
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        })
        .slice()
        .reverse()
    : [];

  return (
    <>
      <VerifyContractModal
        isOpen={isOpen}
        onClose={onClose}
        contractAddress={contractAddress}
      />
      <Flex direction="column" gap={8}>
        <Flex direction="row" alignItems="center" gap={2}>
          <Heading size="title.sm" flex={1}>
            Sources
          </Heading>
          {!prebuiltSource && (
            <Button variant="solid" colorScheme="purple" onClick={onOpen}>
              Verify on {blockExplorerName(chainId)}
            </Button>
          )}
        </Flex>
        <Card>
          <SourcesPanel sources={sources} abi={abi} />
        </Card>
      </Flex>
    </>
  );
};

function blockExplorerUrl(
  chainId: import("@thirdweb-dev/react").ChainId | undefined,
  contractAddress: string,
): string {
  if (!chainId) {
    return "";
  }
  const { url } = blockExplorerMap[chainId];
  if (url) {
    return `${url}address/${contractAddress}#code`;
  }
  return "";
}

function blockExplorerName(
  chainId: import("@thirdweb-dev/react").ChainId | undefined,
): string {
  if (!chainId) {
    return "";
  }
  const { name } = blockExplorerMap[chainId];
  return name;
}
