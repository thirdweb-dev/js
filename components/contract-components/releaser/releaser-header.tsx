import { ens, useReleaserProfile } from "../hooks";
import { EditProfile } from "./edit-profile";
import { ReleaserAvatar } from "./masked-avatar";
import { ReleaserSocials } from "./releaser-socials";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
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
  const ensQuery = ens.useQuery(wallet);
  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );
  const address = useAddress();
  const router = useRouter();
  const isProfilePage = router.pathname === "/[networkOrAddress]";

  const trackEvent = useTrack();

  return (
    <Flex
      flexDirection={{ base: "column", md: page ? "column" : "row" }}
      justifyContent="space-between"
      align="center"
    >
      <Flex direction="column" gap={4} w="full">
        {isProfilePage ? null : <Heading size="title.sm">Released by</Heading>}
        <Flex gap={4} alignItems="center">
          <Skeleton isLoaded={releaserProfile.isSuccess}>
            <Link
              href={`/${ensQuery.data?.ensName || wallet}`}
              onClick={() =>
                trackEvent({
                  category: "releaser-header",
                  action: "click",
                  label: "releaser-avatar",
                })
              }
              pointerEvents={isProfilePage ? "none" : "auto"}
            >
              <ReleaserAvatar
                boxSize={14}
                address={ensQuery.data?.ensName || wallet}
              />
            </Link>
          </Skeleton>

          <Flex flexDir="column">
            <Link
              href={`/${ensQuery.data?.ensName || wallet}`}
              onClick={() =>
                trackEvent({
                  category: "releaser-header",
                  action: "click",
                  label: "releaser-name",
                })
              }
              pointerEvents={isProfilePage ? "none" : "auto"}
            >
              <Heading size="subtitle.sm" ml={2}>
                {releaserProfile?.data?.name ||
                  ensQuery.data?.ensName ||
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
          <LinkButton
            variant="outline"
            size="sm"
            href={`/${wallet}`}
            onClick={() =>
              trackEvent({
                category: "releaser-header",
                action: "click",
                label: "view-all-contracts",
              })
            }
          >
            View all contracts
          </LinkButton>
        )}
        {ensQuery.data?.address === address &&
          !isProfilePage &&
          releaserProfile?.data && (
            <EditProfile releaserProfile={releaserProfile.data} />
          )}
      </Flex>
      {ensQuery.data?.address === address &&
        isProfilePage &&
        releaserProfile?.data && (
          <EditProfile releaserProfile={releaserProfile.data} />
        )}
    </Flex>
  );
};
