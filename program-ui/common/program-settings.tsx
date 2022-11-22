import { Flex } from "@chakra-ui/react";
import { useProgram } from "@thirdweb-dev/react/solana";
import { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import { SettingsCreators } from "program-ui/settings/creators";
import { SettingsRoyalties } from "program-ui/settings/royalties";

export const ProgramSettingsTab: React.FC<{ address: string }> = ({
  address,
}) => {
  const { program } = useProgram(address);

  return (
    <Flex direction="column" height="100%">
      {program instanceof NFTDrop || program instanceof NFTCollection ? (
        <Flex gap={8} direction="column">
          <SettingsCreators program={program} />
          <SettingsRoyalties program={program} />
        </Flex>
      ) : null}
    </Flex>
  );
};
