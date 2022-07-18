import { useReleaserProfile } from "../hooks";
import { EditProfile } from "./edit-profile";
import { ReleaserSocials } from "./releaser-socials";
import { Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { useRouter } from "next/router";
import { Heading, LinkButton, Text } from "tw-components";
import { shortenAddress } from "utils/usedapp-external";

interface ReleaserHeaderProps {
  wallet: string;
  page?: boolean;
}

export const ReleaserHeader: React.FC<ReleaserHeaderProps> = ({
  wallet,
  page,
}) => {
  const releaserProfile = useReleaserProfile(wallet);
  const address = useAddress();
  const router = useRouter();
  const isProfilePage = router.pathname === "/contracts/[wallet]";

  return (
    <Flex
      flexDirection={{ base: "column", md: page ? "column" : "row" }}
      justifyContent="space-between"
    >
      <Flex direction="column" gap={4}>
        <Heading size="title.sm">
          {isProfilePage ? "Author" : "Released by"}
        </Heading>
        <Flex gap={4} alignItems="top">
          <ChakraNextImage
            alt=""
            boxSize={12}
            mt={1}
            src={require("public/assets/others/hexagon.png")}
          />
          <Flex flexDir="column">
            <Heading size="subtitle.sm" ml={2}>
              {/* TODO resolve ENS name */}
              {releaserProfile?.data?.name || shortenAddress(wallet)}
            </Heading>
            {isProfilePage && releaserProfile?.data?.bio && (
              <Text ml={2} noOfLines={2}>
                {releaserProfile.data.bio}
              </Text>
            )}
            {releaserProfile?.data && (
              <ReleaserSocials releaserProfile={releaserProfile.data} />
            )}
          </Flex>
        </Flex>
        {!isProfilePage && (
          <LinkButton href={`/contracts/${wallet}`}>
            View all contracts
          </LinkButton>
        )}
      </Flex>
      {wallet === address && isProfilePage && releaserProfile?.data && (
        <EditProfile releaserProfile={releaserProfile.data} />
      )}
    </Flex>
  );
};
