import { useEnsName, useReleaserProfile, useResolvedEnsName } from "../hooks";
import { EditProfile } from "./edit-profile";
import { ReleaserSocials } from "./releaser-socials";
import { Flex, Image, Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { Heading, Link, LinkButton, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface ReleaserHeaderProps {
  wallet: string;
  page?: boolean;
}
export const ReleaserHeader: React.FC<ReleaserHeaderProps> = ({
  wallet,
  page,
}) => {
  const resolvedAddress = useResolvedEnsName(wallet);
  const releaserProfile = useReleaserProfile(resolvedAddress.data || undefined);
  const address = useAddress();
  const router = useRouter();
  const isProfilePage = router.pathname === "/contracts/[wallet]";

  const ensName = useEnsName(wallet);

  return (
    <Flex
      flexDirection={{ base: "column", md: page ? "column" : "row" }}
      justifyContent="space-between"
    >
      <Flex direction="column" gap={4} w="full">
        <Heading size="title.sm">
          {isProfilePage ? "Author" : "Released by"}
        </Heading>
        <Flex gap={4} alignItems="center">
          <Skeleton isLoaded={releaserProfile.isSuccess}>
            <Image
              alt=""
              boxSize={12}
              mt={1}
              src={
                releaserProfile.data?.avatar ||
                `https://source.boringavatars.com/marble/120/${
                  ensName.data || wallet
                }?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`
              }
            />
          </Skeleton>

          <Flex flexDir="column">
            <Link href={`/contracts/${ensName.data || wallet}`}>
              <Heading size="subtitle.sm" ml={2}>
                {/* TODO resolve ENS name */}
                {releaserProfile?.data?.name ||
                  ensName.data ||
                  shortenIfAddress(wallet)}
              </Heading>
            </Link>
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
          <LinkButton variant="outline" size="sm" href={`/contracts/${wallet}`}>
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
