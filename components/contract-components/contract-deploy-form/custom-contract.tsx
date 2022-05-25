import { ContractIdImage } from "../contract-table/cells/image";
import {
  useConstructorParamsFromABI,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
} from "../hooks";
import { Divider, Flex, FormControl, Input, Skeleton } from "@chakra-ui/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { CustomContractMetadata } from "@thirdweb-dev/sdk/dist/src/schema/contracts/custom";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge, FormHelperText, FormLabel, Heading, Text } from "tw-components";
import {
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
  SupportedChainIdToNetworkMap,
} from "utils/network";

interface CustomContractFormProps {
  ipfsHash: string;
  selectedChain: SUPPORTED_CHAIN_ID | undefined;
  onChainSelect: (chainId: SUPPORTED_CHAIN_ID) => void;
}

const CustomContractForm: React.FC<CustomContractFormProps> = ({
  ipfsHash,
  selectedChain,
  onChainSelect,
}) => {
  const { trackEvent } = useTrack();
  const publishMetadata = useContractPublishMetadataFromURI(ipfsHash);
  const constructorParams = useConstructorParamsFromABI(
    publishMetadata.data?.abi,
  );

  const form =
    useForm<Pick<CustomContractMetadata, "name" | "image" | "description">>();

  const { handleSubmit } = form;
  const [contractParams, _setContractParams] = useState<any[]>([]);
  const setContractParams = useCallback((idx: number, value: any) => {
    _setContractParams((prev) => {
      const newArr = [...prev];
      newArr.splice(idx, 1, value);
      return newArr;
    });
  }, []);

  const deploy = useCustomContractDeployMutation(ipfsHash);
  const wallet = useSingleQueryParam("wallet") || "dashboard";
  const router = useRouter();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

  return (
    <Flex
      flexGrow={1}
      minH="full"
      gap={4}
      direction="column"
      as="form"
      onSubmit={handleSubmit((d) => {
        if (!selectedChain) {
          return;
        }
        const deployData = {
          ipfsHash,
          constructorParams: contractParams,
          contractMetadata: d,
          publishMetadata: publishMetadata.data,
          chainId: selectedChain,
        };
        trackEvent({
          category: "custom-contract",
          action: "deploy",
          label: "attempt",
          deployData,
        });
        deploy.mutate(contractParams, {
          onSuccess: (deployedContractAddress) => {
            console.info("contract deployed:", {
              chainId: selectedChain,
              address: deployedContractAddress,
            });
            trackEvent({
              category: "custom-contract",
              action: "deploy",
              label: "success",
              deployData,
              contractAddress: deployedContractAddress,
            });
            onSuccess();

            router.replace(
              `/${wallet}/${SupportedChainIdToNetworkMap[selectedChain]}/${deployedContractAddress}`,
            );
          },
          onError: (err) => {
            trackEvent({
              category: "custom-contract",
              action: "deploy",
              label: "error",
              deployData,
              error: err,
            });
            onError(err);
          },
        });
      })}
    >
      <Flex gap={4} align="center">
        <ContractIdImage boxSize={12} contractId={ipfsHash} />
        <Flex gap={2} direction="column">
          <Skeleton isLoaded={publishMetadata.isSuccess}>
            <Heading minW="60px" size="subtitle.lg">
              {publishMetadata.data?.name}
            </Heading>
          </Skeleton>
        </Flex>
        <Badge
          display={{ base: "none", md: "inherit" }}
          colorScheme="green"
          variant="outline"
        >
          Smart Contract
        </Badge>
      </Flex>
      {constructorParams?.length ? (
        <>
          <Divider my={4} borderColor="borderColor" />
          <Flex direction="column">
            <Heading size="subtitle.md">Contract Parameters</Heading>
            <Text size="body.md" fontStyle="italic">
              Parameters the contract specifies to be passed in during
              deployment.
            </Text>
          </Flex>
          {/* TODO make this part of the actual form */}
          {constructorParams.map((param, idx) => (
            <FormControl isRequired key={param.name}>
              <FormLabel>{param.name}</FormLabel>
              <Input
                fontFamily={param.type === "address" ? "monospace" : undefined}
                value={contractParams[idx] || ""}
                onChange={(e) => setContractParams(idx, e.currentTarget.value)}
                type="text"
              />
              <FormHelperText>{param.type}</FormHelperText>
            </FormControl>
          ))}
        </>
      ) : null}
      <Divider borderColor="borderColor" mt="auto" />
      <Flex direction="column">
        <Heading size="subtitle.md">Network / Chain</Heading>
        <Text size="body.md" fontStyle="italic">
          Select which network to deploy this contract on.
        </Text>
      </Flex>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <FormControl>
          <SupportedNetworkSelect
            disabledChainIds={SUPPORTED_CHAIN_IDS.filter(
              (c) =>
                c !== ChainId.Mumbai &&
                c !== ChainId.Rinkeby &&
                c !== ChainId.Goerli &&
                c !== ChainId.Polygon,
            )}
            disabledChainIdText="coming soon"
            isDisabled={deploy.isLoading || !publishMetadata.isSuccess}
            value={selectedChain || -1}
            onChange={(e) =>
              onChainSelect(
                parseInt(e.currentTarget.value) as SUPPORTED_CHAIN_ID,
              )
            }
          />
        </FormControl>
        <TransactionButton
          flexShrink={0}
          type="submit"
          isLoading={deploy.isLoading}
          isDisabled={!publishMetadata.isSuccess || !selectedChain}
          colorScheme="primary"
          transactionCount={1}
        >
          Deploy Now
        </TransactionButton>
      </Flex>
    </Flex>
  );
};

export default CustomContractForm;
