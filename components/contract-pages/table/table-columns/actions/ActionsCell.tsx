import { OwnerListAndTransferCell } from "./OwnerListAndTransferCell";
import { ButtonGroup, Stack } from "@chakra-ui/react";
import { NFTMetadataOwner } from "@thirdweb-dev/sdk";
import { Row } from "react-table";

interface IActionsCell {
  row: Row<NFTMetadataOwner>;
}

export const ActionsCell: React.FC<IActionsCell> = ({ row }) => {
  return (
    <Stack as={ButtonGroup} size="sm" variant="outline">
      <OwnerListAndTransferCell row={row} />
    </Stack>
  );
};
