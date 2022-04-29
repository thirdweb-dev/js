import { useContractPublishMetadataFromURI } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Icon, useClipboard } from "@chakra-ui/react";
import { useMemo } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { Button } from "tw-components";

export const ContractBytecodeCell: React.VFC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const publishMetadata = useContractPublishMetadataFromURI(value);

  const code = useMemo(
    () => (publishMetadata.data?.bytecode ? publishMetadata.data.bytecode : ""),
    [publishMetadata.data?.bytecode],
  );

  const { onCopy, hasCopied } = useClipboard(code);

  return (
    <Button
      isDisabled={!publishMetadata.data?.bytecode}
      onClick={onCopy}
      isLoading={publishMetadata.isLoading}
      size="sm"
      variant="outline"
      leftIcon={<Icon boxSize={3} as={hasCopied ? FiCheck : FiCopy} />}
    >
      {hasCopied
        ? "Copied!"
        : publishMetadata.data?.bytecode
        ? "Copy Bytecode"
        : "Not available"}
    </Button>
  );
};
