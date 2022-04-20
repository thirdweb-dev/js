import { useTableContext } from "../../table-context";
import { useEditionDropBalance } from "@3rdweb-sdk/react";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { EditionMetadata } from "@thirdweb-dev/sdk";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React from "react";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { Row } from "react-table";

interface IEditionListAndTransferCellProps {
  row: Row<EditionMetadata>;
}

export const EditionListAndTransferCell: React.FC<
  IEditionListAndTransferCellProps
> = ({ row }) => {
  const tableContext = useTableContext();
  const editionAddress = useSingleQueryParam("edition");
  const editionDropAddress = useSingleQueryParam("edition-drop");

  const { data: balance } = useEditionDropBalance(
    editionAddress || editionDropAddress,
    row.original.metadata.id.toString(),
  );

  if (!balance?.gt(0)) {
    return null;
  }

  return (
    <>
      <Button
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
    </>
  );
};
