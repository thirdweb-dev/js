import { useReleaserProfile } from "../hooks";
import { ReleaserSocials } from "./releaser-socials";
import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, Link } from "tw-components";
import { shortenAddress } from "utils/usedapp-external";

interface ReleaserHeaderProps {
  wallet: string;
}

export const ReleaserHeader: React.FC<ReleaserHeaderProps> = ({ wallet }) => {
  const releaserProfile = useReleaserProfile(wallet);

  return (
    <Flex direction="column" gap={4}>
      <Heading size="title.sm">Released by</Heading>
      <Flex gap={4} alignItems="center">
        <ChakraNextImage
          alt=""
          boxSize={12}
          src={require("public/assets/others/hexagon.png")}
        />
        <Flex flexDir="column">
          <Link href={`/contracts/${wallet}`}>
            <Heading size="subtitle.sm">
              {releaserProfile?.data?.name || shortenAddress(wallet)}
            </Heading>
          </Link>
          {releaserProfile?.data && (
            <ReleaserSocials releaserProfile={releaserProfile.data} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
