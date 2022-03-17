import { useTableContext } from "../../table-context";
import { AdminOnly } from "@3rdweb-sdk/react";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { useEditionDrop } from "@thirdweb-dev/react";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React from "react";
import { FiSettings } from "react-icons/fi";
import { Row } from "react-table";

interface IAdminMintConditionCellProps {
  row: Row<any>;
}

export const AdminMintConditionCell: React.FC<IAdminMintConditionCellProps> = ({
  row,
}) => {
  const contract = useEditionDrop(useSingleQueryParam("edition-drop"));
  const tableContext = useTableContext();

  return (
    <AdminOnly contract={contract}>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          tableContext.expandRow({
            tokenId: row.id,
            type: "settings",
          })
        }
        leftIcon={<Icon as={FiSettings} />}
      >
        Settings
      </Button>
    </AdminOnly>
  );
};
