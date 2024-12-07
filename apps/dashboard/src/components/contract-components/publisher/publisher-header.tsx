"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceDeployerAddress } from "lib/publisher-utils";
import { ZERO_ADDRESS } from "thirdweb";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { Heading, Link, LinkButton } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
import { useEns } from "../hooks";

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
  const client = useThirdwebClient();

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

        <AccountProvider
          // passing zero address during loading time to prevent the component from crashing
          address={ensQuery.data?.address || ZERO_ADDRESS}
          client={client}
        >
          <div className="flex items-center gap-4">
            <Link
              href={replaceDeployerAddress(
                `/${ensQuery.data?.ensName || wallet}`,
              )}
              onClick={() =>
                trackEvent({
                  category: TRACKING_CATEGORY,
                  action: "click",
                  label: "releaser-avatar",
                })
              }
            >
              <AccountAvatar
                fallbackComponent={
                  <AccountBlobbie className="size-14 rounded-full" />
                }
                loadingComponent={<Skeleton className="size-14 rounded-full" />}
                className="size-14 rounded-full"
              />
            </Link>

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
              <AccountName
                fallbackComponent={
                  <AccountAddress
                    formatFn={(addr) =>
                      shortenIfAddress(replaceDeployerAddress(addr))
                    }
                  />
                }
                loadingComponent={<Skeleton className="h-8 w-40" />}
                formatFn={(name) => replaceDeployerAddress(name)}
              />
            </Link>
          </div>
        </AccountProvider>

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
      </Flex>
    </Flex>
  );
};
