import { useEns, useReleaserProfile } from "../hooks";
import { EditProfile } from "./edit-profile";
import { ReleaserAvatar } from "./masked-avatar";
import { ReleaserSocials } from "./releaser-socials";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  replaceDeployerAddress,
  treatAddress,
} from "components/explore/publisher";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading, Link, LinkButton } from "tw-components";

interface ReleaserHeaderProps {
  wallet: string;
  page?: boolean;
}
export const ReleaserHeader: React.FC<ReleaserHeaderProps> = ({
  wallet,
  page,
}) => {
  const ensQuery = useEns(wallet);
  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );
  const address = useAddress();

  const trackEvent = useTrack();

  return (
    <Flex
      flexDirection={{ base: "column", md: page ? "column" : "row" }}
      justifyContent="space-between"
      align="center"
    >
      <Flex direction="column" gap={4} w="full">
        <Heading as="h4" size="title.sm">
          Released by
        </Heading>

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
            >
              <ReleaserAvatar
                alt="Releaser avatar"
                boxSize={14}
                address={ensQuery.data?.ensName || wallet}
              />
            </Link>
          </Skeleton>

          <Flex flexDir="column">
            <Link
              href={replaceDeployerAddress(
                `/${ensQuery.data?.ensName || wallet}`,
              )}
              onClick={() =>
                trackEvent({
                  category: "releaser-header",
                  action: "click",
                  label: "releaser-name",
                })
              }
            >
              <Heading size="subtitle.sm" ml={2}>
                {treatAddress(
                  releaserProfile?.data?.name ||
                    ensQuery.data?.ensName ||
                    wallet,
                )}
              </Heading>
            </Link>
            {releaserProfile?.data && (
              <ReleaserSocials releaserProfile={releaserProfile.data} />
            )}
          </Flex>
        </Flex>

        <LinkButton
          variant="outline"
          size="sm"
          href={replaceDeployerAddress(`/${wallet}`)}
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

        {ensQuery.data?.address === address && releaserProfile?.data && (
          <EditProfile releaserProfile={releaserProfile.data} />
        )}
      </Flex>
    </Flex>
  );
};
