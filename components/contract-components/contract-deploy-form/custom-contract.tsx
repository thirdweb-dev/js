import {
  useConstructorParamsFromABI,
  useContractPublishMetadataFromURI,
  useCustomContractDeployMutation,
} from "../hooks";
import { Divider, Flex, FormControl, Input } from "@chakra-ui/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SupportedNetworkSelect } from "components/selects/SupportedNetworkSelect";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Checkbox,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";
import { SupportedChainIdToNetworkMap } from "utils/network";

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

  const form = useForm<{ addToDashboard: true }>();

  const { register, watch, handleSubmit } = form;
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
        deploy.mutate(
          {
            constructorParams: contractParams,
            addToDashboard: d.addToDashboard,
          },
          {
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
                addToDashboard: d.addToDashboard,
              });
              trackEvent({
                category: "custom-contract",
                action: "add-to-dashboard",
                label: "success",
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
          },
        );
      })}
    >
      {constructorParams?.length ? (
        <>
          <Flex direction="column">
            <Heading size="subtitle.md">Contract Parameters</Heading>
            <Text size="body.md">
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
          <Divider borderColor="borderColor" mt="auto" />
        </>
      ) : null}
      <Flex direction="column">
        <Heading size="subtitle.md">Network / Chain</Heading>
        <Text size="body.md">
          Select a network to deploy this contract on. We recommend starting
          with a testnet.{" "}
          <TrackedLink
            href="https://portal.thirdweb.com/guides/which-network-should-you-use"
            color="primary.500"
            category="deploy"
            label="learn-networks"
            isExternal
          >
            Learn more about the different networks.
          </TrackedLink>
        </Text>
      </Flex>
      <Flex alignItems="center" gap={3}>
        <Checkbox
          autoFocus={true}
          {...register("addToDashboard")}
          defaultChecked
        />
        <Text mt={1}>
          Add to dashboard so I can find it in the list of my contracts at{" "}
          <TrackedLink
            href="https://thirdweb.com/dashboard"
            isExternal
            category="custom-contract"
            label="visit-dashboard"
            color="primary.500"
          >
            /dashboard
          </TrackedLink>
          .
        </Text>
      </Flex>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <FormControl>
          <SupportedNetworkSelect
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
          transactionCount={!watch("addToDashboard") ? 1 : 2}
        >
          Deploy Now
        </TransactionButton>
      </Flex>
    </Flex>
  );
};

export default CustomContractForm;
