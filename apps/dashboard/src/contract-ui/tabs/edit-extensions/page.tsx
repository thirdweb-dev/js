import {
  Alert,
  AlertIcon,
  Flex,
  Spacer,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { defineChain, getContract } from "thirdweb";
import { getInstalledExtensions, owner } from "thirdweb/extensions/modular";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useEVMContractInfo } from "../../../@3rdweb-sdk/react";
import { thirdwebClient } from "../../../lib/thirdweb-client";
import { Heading, Text } from "../../../tw-components";
import { InstallExtensionForm } from "./components/ExtensionForm";
import { InstalledExtensionsTable } from "./components/InstalledExtensionsTable";

interface ContractEditExtensionsPageProps {
  contractAddress?: string;
}

export const ContractEditExtensionsPage: React.FC<
  ContractEditExtensionsPageProps
> = ({ contractAddress }) => {
  const contractInfo = useEVMContractInfo();

  const chainId = contractInfo?.chain?.chainId;

  if (!contractAddress || !chainId) {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center" h={[300, 500]}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return <Content contractAddress={contractAddress} chainId={chainId} />;
};

function Content(props: { contractAddress: string; chainId: number }) {
  const { contractAddress, chainId } = props;
  const account = useActiveAccount();

  const contract = useMemo(
    () =>
      getContract({
        client: thirdwebClient,
        address: contractAddress,
        chain: defineChain(chainId),
      }),
    [contractAddress, chainId],
  );

  const installedExtensionsQuery = useReadContract(getInstalledExtensions, {
    contract,
  });

  const ownerQuery = useReadContract(owner, {
    contract,
  });

  function refetchExtensions() {
    installedExtensionsQuery.refetch();
  }

  if (ownerQuery.isLoading) {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center" h={[300, 500]}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!ownerQuery.data) {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center" h={[300, 500]}>
        <Text> Failed to resolve contract owner </Text>
      </Flex>
    );
  }

  const isOwner = ownerQuery.data === account?.address;

  const installedExtensions = {
    isLoading: installedExtensionsQuery.isLoading,
    data: installedExtensionsQuery.data
      ? installedExtensionsQuery.data.map((x) => x.implementation)
      : [],
  };

  return (
    <Stack direction="column" spacing={4}>
      {/* Alert */}
      {isOwner && (
        <>
          <Heading as="h2" size="title.md">
            Edit Extensions
          </Heading>
          <Alert
            status="info"
            fontSize={"small"}
            borderRadius="md"
            p={3}
            bg="alertBg"
            borderLeft="4px solid"
            borderLeftColor="blue.500"
          >
            <AlertIcon />
            <Flex direction="column" gap={0.5} ml={1}>
              <Text color="heading" size="body.lg" fontWeight={500}>
                Add capabilities to your contract by installing extensions.
              </Text>
              <Text>Lookup extensions to install in your contract</Text>
            </Flex>
          </Alert>
          <Spacer h={10} />
          <InstallExtensionForm
            contract={contract}
            refetchExtensions={refetchExtensions}
            account={account}
            installedExtensions={installedExtensions}
          />
        </>
      )}

      {!isOwner && (
        <>
          <Alert
            status="error"
            fontSize={"small"}
            borderRadius="md"
            p={3}
            bg="alertBg"
          >
            <AlertIcon />
            <Flex direction="column" gap={0.5} ml={1}>
              <Text color="heading" size="body.lg" fontWeight={500}>
                You do not have permissions to edit extensions
              </Text>
              <Text>Connect owner wallet to edit extensions</Text>
            </Flex>
          </Alert>
        </>
      )}

      <Spacer h={14} />

      <InstalledExtensionsTable
        installedExtensions={installedExtensions}
        refetchExtensions={refetchExtensions}
        contract={contract}
        ownerAccount={isOwner ? account : undefined}
      />
    </Stack>
  );
}
