import { AdminMintConditionCell } from "./AdminMintConditionCell";
import { EditionAirdropCell } from "./EditionAirdropCell";
import { EditionBurnCell } from "./EditionBurnCell";
import { EditionTransferCell } from "./EditionTransferCell";
import { OwnerBurnCell } from "./OwnerBurnCell";
import { OwnerTransferCell } from "./OwnerTransferCell";
import { ButtonGroup, Stack } from "@chakra-ui/react";
import { EditionMetadata, NFTMetadataOwner } from "@thirdweb-dev/sdk";
import { Row } from "react-table";

interface INFTActionsCell {
  row: Row<NFTMetadataOwner>;
}

interface IEditionActionsCell {
  row: Row<EditionMetadata>;
}

const ERC721Cell: React.FC<INFTActionsCell> = ({ row }) => (
  <>
    <OwnerTransferCell row={row} />
    <OwnerBurnCell row={row} />
  </>
);

const ERC1155Cell: React.FC<IEditionActionsCell> = ({ row }) => (
  <>
    <EditionTransferCell row={row} />
    <EditionAirdropCell row={row} />
    <EditionBurnCell row={row} />
  </>
);

export const NFTActionsCell: React.FC<INFTActionsCell> = ({ row }) => {
  return (
    <Stack as={ButtonGroup} size="sm" variant="outline">
      <ERC721Cell row={row} />
    </Stack>
  );
};

export const EditionActionsCell: React.FC<IEditionActionsCell> = ({ row }) => {
  return (
    <Stack as={ButtonGroup} size="sm" variant="outline">
      <ERC1155Cell row={row} />
    </Stack>
  );
};

export const EditionDropActionsCell: React.FC<IEditionActionsCell> = ({
  row,
}) => {
  return (
    <Stack as={ButtonGroup} size="sm" variant="outline">
      <AdminMintConditionCell row={row} />
      <ERC1155Cell row={row} />
    </Stack>
  );
};
