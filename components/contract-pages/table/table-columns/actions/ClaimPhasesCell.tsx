import { useTableContext } from "../../table-context";
import Icon from "@chakra-ui/icon";
import React from "react";
import { FiSettings } from "react-icons/fi";
import { Row } from "react-table";
import { Button } from "tw-components";

interface IClaimPhasesCellProps {
  row: Row<any>;
}

export const ClaimPhasesCell: React.FC<IClaimPhasesCellProps> = ({ row }) => {
  const tableContext = useTableContext();

  return (
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
      Claim Phases
    </Button>
  );
};
