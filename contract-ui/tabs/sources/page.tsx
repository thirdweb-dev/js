import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
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
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { useContract } from "@thirdweb-dev/react";
import { Abi } from "@thirdweb-dev/sdk";
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import { useContractSources } from "contract-ui/hooks/useContractSources";
import { useConfiguredChain } from "hooks/chains/configureChains";
import { useRouter } from "next/router";
import { VerificationStatus, blockExplorerMap } from "pages/api/verify";
import { useMemo } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Badge, Button, Card, Heading, LinkButton } from "tw-components";

interface CustomContractSourcesPageProps {
  contractAddress?: string;
}

type VerifyContractParams = {
  contractAddress: string;
  chainId: number;
};

export async function verifyContract({
  contractAddress,
  chainId,
}: VerifyContractParams) {
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
}

function useVerifyCall(shouldFetch: boolean, contractAddress = "") {
  const chainId = useDashboardEVMChainId();
  return useQueryWithNetwork(
    ["verify", contractAddress],
    () => (chainId ? verifyContract({ contractAddress, chainId }) : null),
    {
      enabled: !!contractAddress && !!chainId && shouldFetch,
    },
  );
}

function useCheckVerificationStatus(guid?: string) {
  const chainId = useDashboardEVMChainId();
  return useQueryWithNetwork(
    ["verifycheck", guid],
    async () => {
      const response = await fetch(
        `/api/check-verification-status?guid=${guid}&chainId=${chainId}`,
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
  const chainId = useDashboardEVMChainId();

  const chainInfo = useConfiguredChain(chainId || -1);

  const blockExplorerName =
    getBlockExplorerName(chainId) ||
    (chainInfo && chainInfo.explorers?.[0].name) ||
    "";

  const blockExplorerUrl =
    getBlockExplorerUrl(chainId, contractAddress) ||
    (chainInfo && chainInfo.explorers?.[0].url) ||
    "";

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
          {showLinkButton && blockExplorerUrl && (
            <LinkButton
              variant="outline"
              size="sm"
              href={blockExplorerUrl}
              isExternal
            >
              View on {blockExplorerName}
            </LinkButton>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function useDefaultChainsRecord() {
  return useMemo(() => {
    const record: Record<number, Chain> = {};
    for (const chain of defaultChains) {
      record[chain.chainId] = chain;
    }
    return record;
  }, []);
}

export const CustomContractSourcesPage: React.FC<
  CustomContractSourcesPageProps
> = ({ contractAddress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contractSourcesQuery = useContractSources(contractAddress);
  const chainId = useDashboardEVMChainId();
  const defaultChainsRecord = useDefaultChainsRecord();
  const isDefaultChain = chainId && chainId in defaultChainsRecord;

  const router = useRouter();
  const forceVerifyButton = router.query.verify === "true";

  const { data: prebuiltSource } = usePrebuiltSource(contractAddress);
  const { contract } = useContract(contractAddress);

  const abi = useMemo(() => contract?.abi as Abi, [contract]);

  // clean up the source filenames and filter out libraries
  const sources = useMemo(() => {
    return contractSourcesQuery.data
      ? contractSourcesQuery.data
          .map((source) => {
            return {
              ...source,
              filename: source.filename.split("/").pop(),
            };
          })
          .slice()
          .reverse()
      : prebuiltSource
      ? [prebuiltSource]
      : [];
  }, [contractSourcesQuery.data, prebuiltSource]);

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  if (
    (!contractSourcesQuery || contractSourcesQuery?.isLoading) &&
    !prebuiltSource
  ) {
    return (
      <Flex direction="row" align="center" gap={2}>
        <Spinner color="purple.500" size="xs" />
        <Heading size="title.sm">Loading...</Heading>
      </Flex>
    );
  }

  const blockExplorerUrl = getBlockExplorerUrl(chainId, contractAddress);
  const blockExplorerName = getBlockExplorerName(chainId);

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

          {isDefaultChain && (
            <>
              {!prebuiltSource || forceVerifyButton ? (
                <Button variant="solid" colorScheme="purple" onClick={onOpen}>
                  Verify on {blockExplorerName}
                </Button>
              ) : blockExplorerUrl ? (
                <LinkButton
                  variant="ghost"
                  colorScheme="green"
                  isExternal
                  size="sm"
                  noIcon
                  href={blockExplorerUrl}
                  leftIcon={<Icon as={FiCheckCircle} />}
                >
                  Verified on {blockExplorerName}
                </LinkButton>
              ) : null}
            </>
          )}
        </Flex>
        <Card p={0}>
          <SourcesPanel sources={sources} abi={abi} />
        </Card>
      </Flex>
    </>
  );
};

function getBlockExplorerUrl(
  chainId: number | undefined,
  contractAddress: string,
): string {
  if (!chainId) {
    return "";
  }

  if (chainId in blockExplorerMap) {
    const { url } = blockExplorerMap[chainId];

    if (url) {
      return `${url}address/${contractAddress}#code`;
    }
  }

  return "";
}

function getBlockExplorerName(chainId: number | undefined): string {
  if (!chainId) {
    return "";
  }
  if (chainId in blockExplorerMap) {
    const { name } = blockExplorerMap[chainId];
    return name;
  }
  return "";
}
