import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Icon, Tooltip } from "@chakra-ui/react";
import { useSDK } from "@thirdweb-dev/react";
import { AbiFunction, PublishedContract } from "@thirdweb-dev/sdk";
import { BiPencil } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";
import { Badge, Card, Heading, Text } from "tw-components";

interface ExtractedContractFunctionsProps {
  contractRelease: PublishedContract;
}

interface ContractFunctionProps {
  fn: AbiFunction;
}

function useReleasedContractFunctions(contractRelease: PublishedContract) {
  const sdk = useSDK();
  return useQuery(
    ["contract-functions", contractRelease.metadataUri],
    async () => {
      invariant(contractRelease, "contract is not defined");
      invariant(sdk, "sdk not provided");
      return await sdk
        ?.getPublisher()
        .extractFunctions(contractRelease.metadataUri);
    },
    {
      enabled: !!contractRelease && !!sdk,
    },
  );
}

const ContractFunction: React.FC<ContractFunctionProps> = ({ fn }) => {
  return (
    <Flex alignItems="center" gap={2}>
      <Heading size="label.md">{fn.name}</Heading>
      {fn.comment && (
        <Tooltip
          bg="transparent"
          boxShadow="none"
          p={0}
          label={
            <Card>
              <Text>{fn.comment}</Text>
            </Card>
          }
        >
          <Icon as={InfoIcon} color="gray.700" />
        </Tooltip>
      )}
      {fn.stateMutability === "payable" && (
        <Badge
          size="label.sm"
          variant="subtle"
          rounded={6}
          px={2}
          backgroundColor="green.600"
        >
          Payable
        </Badge>
      )}
    </Flex>
  );
};

export const ExtractedContractFunctions: React.FC<
  ExtractedContractFunctionsProps
> = ({ contractRelease }) => {
  const { data: contractFunctions } =
    useReleasedContractFunctions(contractRelease);
  return (
    <Flex gap={4} px={6} pt={2} pb={5}>
      <Flex flexDir="column" flex="1" gap={3}>
        <Badge size="label.sm" variant="subtle" rounded={6} p={2}>
          <Icon as={BiPencil} mr={2} />
          Actions
        </Badge>
        {(contractFunctions || [])
          .filter(
            (f) => f.stateMutability !== "view" && f.stateMutability !== "pure",
          )
          .map((fn) => (
            <ContractFunction key={fn.name} fn={fn} />
          ))}
      </Flex>
      <Flex flexDir="column" flex="1" gap={3}>
        <Badge size="label.sm" variant="subtle" rounded={6} p={2}>
          <Icon as={BsEye} mr={2} />
          State
        </Badge>
        {(contractFunctions || [])
          .filter(
            (f) => f.stateMutability === "view" || f.stateMutability === "pure",
          )
          .map((fn) => (
            <ContractFunction key={fn.name} fn={fn} />
          ))}
      </Flex>
    </Flex>
  );
};
