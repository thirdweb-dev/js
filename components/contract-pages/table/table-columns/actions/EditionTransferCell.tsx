import { useTableContext } from "../../table-context";
import { useEditionDropBalance } from "@3rdweb-sdk/react";
import Icon from "@chakra-ui/icon";
import { Box, Tooltip } from "@chakra-ui/react";
import { EditionMetadata } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React from "react";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { Row } from "react-table";
import { Button } from "tw-components";

interface IEditionTransferCellProps {
  row: Row<EditionMetadata>;
}

export const EditionTransferCell: React.FC<IEditionTransferCellProps> = ({
  row,
}) => {
  const tableContext = useTableContext();
  const editionAddress = useSingleQueryParam("edition");
  const editionDropAddress = useSingleQueryParam("edition-drop");

  const { data: balance } = useEditionDropBalance(
    editionAddress || editionDropAddress,
    row.original.metadata.id.toString(),
  );

  const ownsAtLeastOne = BigNumber.from(balance || 0).gt(0);

  return (
    <Tooltip
      label={`You do not own at least 1 NFT. Your balance: ${
        balance?.toString() || 0
      }`}
      isDisabled={ownsAtLeastOne}
    >
      <Box>
        <Button
          w="full"
          isDisabled={!ownsAtLeastOne}
          onClick={() =>
            tableContext.expandRow({
              tokenId: row.original.metadata.id.toString(),
              type: "transfer",
            })
          }
          leftIcon={<Icon as={MdDriveFileMoveOutline} />}
        >
          Transfer
        </Button>
      </Box>
    </Tooltip>
  );
};
