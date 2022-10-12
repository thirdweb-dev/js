import { NFTGetAllTable } from "../components/table";
import { NFTBatchUploadButton } from "./nft-batch-upload-button";
import { NFTClaimButton } from "./nft-claim-button";
import { NFTSingleUploadButton } from "./nft-single-upload-button";
import { Flex } from "@chakra-ui/react";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";
import { Heading } from "tw-components";

export const NFTDropPanel: React.FC<{
  program: NFTDrop;
}> = ({ program }) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Program NFTs</Heading>
        <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
          <NFTClaimButton program={program} />
          <NFTSingleUploadButton program={program} />
          <NFTBatchUploadButton program={program} />
        </Flex>
      </Flex>
      <NFTGetAllTable program={program} />
    </Flex>
  );
};
