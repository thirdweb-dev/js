import { Flex, Image, List, ListItem } from "@chakra-ui/react";
import { useContractEnabledExtensions } from "components/contract-components/hooks";
import { ContractInterface } from "ethers";
import { Heading, Text, TrackedLink } from "tw-components";

type ExtensionsProps = {
  abi: ContractInterface;
};

export const Extensions: React.FC<ExtensionsProps> = ({ abi }) => {
  const enabledExtensions = useContractEnabledExtensions(abi);

  return (
    <Flex flexDir="column" gap={4}>
      <Heading as="h4" size="title.sm">
        Extensions
      </Heading>
      <List as={Flex} flexDir="column" gap={3}>
        {enabledExtensions.length ? (
          enabledExtensions.map((extension) => (
            <ListItem key={extension.name}>
              <Flex gap={2} alignItems="center">
                <Image
                  src="/assets/dashboard/extension-check.svg"
                  alt="Extension detected"
                  objectFit="contain"
                  mb="2px"
                />
                <Text size="label.md">
                  <TrackedLink
                    href={`https://portal.thirdweb.com/solidity/extensions/${extension.docLinks.contracts}`}
                    isExternal
                    category="extension"
                    label={extension.name}
                  >
                    {extension.name}
                  </TrackedLink>
                </Text>
              </Flex>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <Text size="body.md" fontStyle="italic">
              No extensions detected
            </Text>
          </ListItem>
        )}
      </List>
    </Flex>
  );
};
