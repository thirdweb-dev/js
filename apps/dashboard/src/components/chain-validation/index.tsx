import {
  Code,
  Flex,
  FormControl,
  Icon,
  Input,
  InputGroup,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useRpcValidation } from "hooks/chains/useRpcValidation";
import { ChangeEvent, useMemo, useState } from "react";
import { IconType } from "react-icons";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { RiErrorWarningLine } from "react-icons/ri";
import { Button, Card, FormLabel, Link, TableContainer } from "tw-components";

const StatusCheck = ({
  status,
}: {
  status: "success" | "error" | "warning";
}) => {
  const values: [string, IconType] = useMemo(() => {
    if (status === "error") {
      return ["red.500", BiErrorCircle];
    } else if (status === "warning") {
      return ["yellow.500", RiErrorWarningLine];
    } else {
      return ["green.500", BiCheckCircle];
    }
  }, [status]);

  return <Icon fontSize={16} color={values[0]} as={values[1]} />;
};

const ChainValidation: React.FC<{}> = () => {
  const [rpcUrl, setRpcUrl] = useState("");
  const [validationReport, validate] = useRpcValidation(rpcUrl);
  const [validated, setValidated] = useState(false);
  const existingChain = validationReport?.existingChain;

  const trackEvent = useTrack();

  const handleValidate = () => {
    if (rpcUrl.length > 0) {
      validate();
      setValidated(true);

      trackEvent({
        category: "validation",
        action: "validate",
        label: "rpc",
        url: rpcUrl,
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRpcUrl(e.currentTarget.value);
    setValidated(false);
  };

  return (
    <Card maxW="xl">
      <Flex direction="column" gap={6}>
        <FormControl gap={6}>
          <FormLabel>RPC URL</FormLabel>
          <InputGroup gap={2}>
            <Input
              isInvalid={rpcUrl.length > 0 && !validationReport.urlValid}
              value={rpcUrl}
              onChange={handleChange}
              placeholder="https://rpc.yourchain.com/rpc"
              type="url"
            />
            <Button onClick={handleValidate} colorScheme="primary">
              Validate
            </Button>
          </InputGroup>
        </FormControl>

        {validated && (
          <TableContainer>
            <Table variant="unstyled">
              <Thead>
                <Tr>
                  <Th colSpan={2}>RPC validation report</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>RPC URL valid</Td>
                  <Td textAlign="right">
                    <StatusCheck
                      status={validationReport.urlValid ? "success" : "error"}
                    />
                  </Td>
                </Tr>
                {validationReport.urlValid && (
                  <>
                    <Tr>
                      <Td>
                        RPC supports <Code>eth_chainId</Code> method
                      </Td>
                      <Td textAlign="right">
                        <StatusCheck
                          status={
                            validationReport.chainIdSupported
                              ? "success"
                              : "error"
                          }
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        RPC supports <Code>eth_blockNumber</Code> method
                      </Td>
                      <Td textAlign="right">
                        <StatusCheck
                          status={
                            validationReport.blockNumberSupported
                              ? "success"
                              : "error"
                          }
                        />
                      </Td>
                    </Tr>
                    {validationReport.chainIdSupported && (
                      <Tr>
                        <Td>
                          Chain ID{" "}
                          {existingChain?.id ? (
                            <Code mr={1}>{existingChain.id}</Code>
                          ) : (
                            ""
                          )}
                          {!existingChain
                            ? "is available"
                            : existingChain?.mainnet
                              ? "is already on mainnet"
                              : "is on testnet"}
                          {existingChain?.infoURL && (
                            <Link
                              ml={1}
                              textDecoration="underline"
                              _hover={{ color: "blue.500" }}
                              href={existingChain.infoURL}
                              isExternal
                            >
                              visit site
                            </Link>
                          )}
                        </Td>

                        <Td textAlign="right">
                          <StatusCheck
                            status={
                              existingChain
                                ? existingChain.mainnet
                                  ? "error"
                                  : "warning"
                                : "success"
                            }
                          />
                        </Td>
                      </Tr>
                    )}
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </Card>
  );
};

export default ChainValidation;
