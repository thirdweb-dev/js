import { Flex, GridItem, List, ListItem, SimpleGrid } from "@chakra-ui/react";
import { AbiFunction } from "@thirdweb-dev/sdk";
import { useState } from "react";
import { Badge, Button, Card, Heading, Text } from "tw-components";

interface ContractFunctionProps {
  fn?: AbiFunction;
}

export const ContractFunction: React.FC<ContractFunctionProps> = ({ fn }) => {
  if (!fn) {
    return null;
  }
  return (
    <Flex direction="column" gap={1.5}>
      <Flex alignItems="center" gap={2}>
        <Heading size="subtitle.md">{fn.name}</Heading>
        {fn.stateMutability === "payable" && (
          <Badge size="label.sm" variant="subtle" colorScheme="green">
            Payable
          </Badge>
        )}
      </Flex>
      {fn.comment && (
        <Text size="body.md">
          {fn.comment
            .replaceAll(/See \{(.+)\}(\.)?/gm, "")
            .replaceAll("{", '"')
            .replaceAll("}", '"')}
        </Text>
      )}
    </Flex>
  );
};

interface ContractFunctionsPanelProps {
  functions: AbiFunction[];
}

export const ContractFunctionsPanel: React.FC<ContractFunctionsPanelProps> = ({
  functions,
}) => {
  const [selectedFunction, setSelectedFunction] = useState<AbiFunction>(
    functions[0],
  );
  return (
    <SimpleGrid columns={12}>
      <GridItem
        colSpan={{ base: 12, md: 3 }}
        borderRightWidth={{ base: "0px", md: "1px" }}
        borderBottomWidth={{ base: "1px", md: "0px" }}
        borderColor="borderColor"
      >
        <List
          overflow="auto"
          h={{ base: "300px", md: "500px" }}
          pr={{ base: 0, md: 3 }}
          mb={{ base: 3, md: 0 }}
        >
          {functions.map((fn) => (
            <ListItem key={fn.signature} my={0.5}>
              <Button
                fontWeight={
                  selectedFunction.signature === fn.signature ? 600 : 400
                }
                opacity={selectedFunction.signature === fn.signature ? 1 : 0.65}
                onClick={() => setSelectedFunction(fn)}
                color="heading"
                _hover={{ opacity: 1, textDecor: "underline" }}
                variant="link"
                fontFamily="mono"
              >
                {fn.name}
              </Button>
            </ListItem>
          ))}
        </List>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 9 }}>
        <Card ml={{ base: 0, md: 3 }} mt={{ base: 3, md: 0 }} flexGrow={1}>
          <ContractFunction fn={selectedFunction} />
        </Card>
      </GridItem>
    </SimpleGrid>
  );
};
