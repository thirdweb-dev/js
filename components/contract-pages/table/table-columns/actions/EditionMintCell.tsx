import { useTableContext } from "../../table-context";
import { useIsMinter } from "@3rdweb-sdk/react";
import Icon from "@chakra-ui/icon";
import { Box, Tooltip } from "@chakra-ui/react";
import { useEdition } from "@thirdweb-dev/react";
import { EditionMetadata } from "@thirdweb-dev/sdk";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React from "react";
import { ImStack } from "react-icons/im";
import { Row } from "react-table";
import { Button } from "tw-components";

interface IEditionMintCellProps {
  row: Row<EditionMetadata>;
}

export const EditionMintCell: React.FC<IEditionMintCellProps> = ({ row }) => {
  const tableContext = useTableContext();
  const editionAddress = useSingleQueryParam("edition");
  const edition = useEdition(editionAddress);

  const isMinter = useIsMinter(edition);

  return (
    <Tooltip
      label="You do not have the creator role on this contract"
      isDisabled={isMinter}
    >
      <Box>
        <Button
          w="full"
          isDisabled={!isMinter}
          onClick={() =>
            tableContext.expandRow({
              tokenId: row.original.metadata.id.toString(),
              type: "mint",
            })
          }
          leftIcon={<Icon as={ImStack} />}
        >
          Mint
        </Button>
      </Box>
    </Tooltip>
  );
};
