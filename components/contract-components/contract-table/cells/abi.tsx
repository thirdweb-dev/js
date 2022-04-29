import { useContractPublishMetadataFromURI } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Icon, useClipboard, useDisclosure } from "@chakra-ui/react";
import { useMemo } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { Button, CodeBlock, Drawer, Heading } from "tw-components";

export const ContractAbiCell: React.VFC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const publishMetadata = useContractPublishMetadataFromURI(value);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const code = useMemo(
    () =>
      publishMetadata.data?.abi
        ? JSON.stringify(publishMetadata.data.abi, null, 2)
        : "",
    [publishMetadata.data?.abi],
  );

  const { onCopy, hasCopied } = useClipboard(code);

  return (
    <>
      <Drawer
        header={{
          children: <Heading size="subtitle.md">Contract ABI</Heading>,
        }}
        footer={{
          children: (
            <Button
              onClick={onCopy}
              colorScheme="primary"
              leftIcon={<Icon boxSize={3} as={hasCopied ? FiCheck : FiCopy} />}
            >
              {hasCopied ? "Copied!" : "Copy ABI"}
            </Button>
          ),
        }}
        size="lg"
        isOpen={isOpen}
        onClose={onClose}
      >
        <CodeBlock w="full" whiteSpace="pre-wrap" language="json" code={code} />
      </Drawer>
      <Button
        isDisabled={!publishMetadata.data?.abi}
        onClick={onOpen}
        isLoading={publishMetadata.isLoading}
        size="sm"
        variant="outline"
      >
        {publishMetadata.data?.abi ? "Show ABI" : "Not available"}
      </Button>
    </>
  );
};
