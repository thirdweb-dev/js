import { useImportContract } from "@3rdweb-sdk/react/hooks/useImportContract";
import {
  Center,
  Container,
  Divider,
  Flex,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { Chain } from "@thirdweb-dev/chains";
import { ChakraNextImage } from "components/Image";
import { useCallback, useEffect, useRef } from "react";
import { FiCheck, FiExternalLink } from "react-icons/fi";
import { Button, Card, Heading, Text, TrackedLink } from "tw-components";

interface ImportContractProps {
  contractAddress: string;
  chain: Chain | null;
  autoImport?: boolean;
  onImport: ({
    contractAddress,
    chain,
  }: {
    contractAddress: string;
    chain: Chain;
  }) => void;
}

export const ImportContract: React.FC<ImportContractProps> = ({
  contractAddress,
  chain,
  autoImport,

  onImport,
}) => {
  const importContract = useImportContract();

  const handleImportContract = useCallback(() => {
    if (!chain) {
      return;
    }

    importContract.mutate(
      { contractAddress, chain },
      {
        onSuccess: onImport,
      },
    );
  }, [chain, contractAddress, importContract, onImport]);

  const didAutoImportRef = useRef(false);
  useEffect(() => {
    if (autoImport && chain && !didAutoImportRef.current) {
      didAutoImportRef.current = true;
      // for some reason this needs to be deferred to the next event loop otherwise we don't get the correct staus reports from the query
      setTimeout(() => {
        handleImportContract();
      }, 0);
    }
  }, [autoImport, chain, handleImportContract]);

  return (
    <Container maxW="container.page" h="full">
      <Center h="full">
        <Card
          w="container.sm"
          as={Flex}
          flexDirection="column"
          py={12}
          px={16}
          gap={8}
        >
          <ChakraNextImage
            boxSize={16}
            src={require("./wrench.png")}
            alt="🔧"
          />
          <Flex direction="column" gap={6}>
            <Flex gap={4} align="center">
              <Heading as="h2" size="title.lg">
                {importContract.isLoading
                  ? "Importing contract"
                  : importContract.error
                  ? "Contract could not be imported."
                  : importContract.isSuccess
                  ? "Import successful!"
                  : "Contract requires import."}
              </Heading>
              {importContract.isLoading && (
                <Spinner
                  boxSize={8}
                  color="blue.400"
                  _light={{ color: "blue.600" }}
                  size="md"
                />
              )}
              {importContract.isSuccess && (
                <Icon
                  boxSize={8}
                  as={FiCheck}
                  color="green.400"
                  _light={{ color: "green.600" }}
                />
              )}
            </Flex>
            <Text>
              {importContract.isError ? (
                <>
                  We could not resolve your contract&apos;s ABI or your contract
                  may be deployed on a network that is not yet supported for
                  automatic import. You can{" "}
                  <TrackedLink
                    href="https://sourcify.dev/#/verifier"
                    category="import-contract"
                    label="sourcify"
                    fontSize="inherit"
                    fontWeight="inherit"
                    isExternal
                    color="heading"
                  >
                    verify your contract on Sourcify
                  </TrackedLink>{" "}
                  and then try{" "}
                  <Button
                    onClick={handleImportContract}
                    variant="link"
                    fontSize="inherit"
                    fontWeight="inherit"
                  >
                    importing again
                  </Button>
                  .
                </>
              ) : (
                `This is a one-time action. Once imported, the contract can be
              accessed by everyone. This can take up to a few minutes.`
              )}
            </Text>

            <Flex direction="column" gap={1.5} align="center">
              {importContract.isError ? (
                <Button
                  as={TrackedLink}
                  href="https://sourcify.dev/#/verifier"
                  category="import-contract"
                  label="sourcify"
                  w="full"
                  colorScheme="purple"
                  isExternal
                  textDecor="none!important"
                  rightIcon={<Icon as={FiExternalLink} />}
                >
                  Verify Contract on Sourcify
                </Button>
              ) : (
                !importContract.isSuccess &&
                !autoImport && (
                  <Button
                    w="full"
                    colorScheme="blue"
                    isLoading={importContract.isLoading}
                    isDisabled={importContract.isSuccess || !chain}
                    loadingText="Importing"
                    onClick={handleImportContract}
                  >
                    Import Contract
                  </Button>
                )
              )}
            </Flex>

            <Divider />
            <Text>
              If you require assistance please{" "}
              <TrackedLink
                _dark={{
                  color: "blue.400",
                }}
                _light={{
                  color: "blue.600",
                }}
                category="import-contract"
                label="support"
                href="https://support.thirdweb.com/how-to-reach-us/gY4SUcfwkzcy5XjnWZvYiE"
                isExternal
              >
                reach out to us
              </TrackedLink>
              .
            </Text>
          </Flex>
        </Card>
      </Center>
    </Container>
  );
};
