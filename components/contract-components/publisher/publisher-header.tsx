import { useEns, usePublisherProfile } from "../hooks";
import { PublisherSocials } from "./PublisherSocials";
import { EditProfile } from "./edit-profile";
import { PublisherAvatar } from "./masked-avatar";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  replaceDeployerAddress,
  treatAddress,
} from "components/explore/publisher";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading, Link, LinkButton } from "tw-components";

const TRACKING_CATEGORY = "releaser-header";

interface PublisherHeaderProps {
  wallet: string;
  page?: boolean;
}
export const PublisherHeader: React.FC<PublisherHeaderProps> = ({
  wallet,
  page,
}) => {
  const ensQuery = useEns(wallet);
  const publisherProfile = usePublisherProfile(
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
          Published by
        </Heading>

        <Flex gap={4} alignItems="center">
          <Skeleton isLoaded={publisherProfile.isSuccess}>
            <Link
              href={`/${ensQuery.data?.ensName || wallet}`}
              onClick={() =>
                trackEvent({
                  category: TRACKING_CATEGORY,
                  action: "click",
                  label: "releaser-avatar",
                })
              }
            >
              <PublisherAvatar
                alt="Publisher avatar"
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
                  category: TRACKING_CATEGORY,
                  action: "click",
                  label: "releaser-name",
                })
              }
            >
              <Heading size="subtitle.sm" ml={2}>
                {treatAddress(
                  publisherProfile?.data?.name ||
                    ensQuery.data?.ensName ||
                    wallet,
                )}
              </Heading>
            </Link>
            {publisherProfile?.data && (
              <PublisherSocials publisherProfile={publisherProfile.data} />
            )}
          </Flex>
        </Flex>

        <LinkButton
          variant="outline"
          size="sm"
          href={replaceDeployerAddress(`/${wallet}`)}
          onClick={() =>
            trackEvent({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "view-all-contracts",
            })
          }
        >
          View all contracts
        </LinkButton>

        {ensQuery.data?.address === address && publisherProfile?.data && (
          <EditProfile publisherProfile={publisherProfile.data} />
        )}
      </Flex>
    </Flex>
  );
};
