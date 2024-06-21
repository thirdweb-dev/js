import { List, ListItem } from "@chakra-ui/react";
import type { WalletNFT } from "lib/wallet/nfts/types";
import { Card } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface ListLabelProps {
  nft: WalletNFT;
}

export const ListLabel: React.FC<ListLabelProps> = ({ nft }) => {
  return (
    <Card color="paragraph" p={4} bg="backgroundCardHighlight">
      <List>
        <ListItem>
          <strong>Name:</strong> {nft.metadata?.name || "N/A"}
        </ListItem>
        <ListItem>
          <strong>Contract Address:</strong>{" "}
          {shortenIfAddress(nft.contractAddress)}
        </ListItem>
        <ListItem>
          <strong>Token ID: </strong> {nft.tokenId}
        </ListItem>
        <ListItem>
          <>
            <strong>Token Standard: </strong> {nft.type}
          </>
        </ListItem>
      </List>
    </Card>
  );
};
