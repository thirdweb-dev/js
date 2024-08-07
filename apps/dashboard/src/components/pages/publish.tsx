import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
/* eslint-disable @next/next/no-img-element */
import { Divider, Flex, GridItem, Icon, SimpleGrid } from "@chakra-ui/react";
import { useAllVersions, useEns } from "components/contract-components/hooks";
import { PublishedContract } from "components/contract-components/published-contract";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import { ChevronsRightIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { TrackedIconButton } from "tw-components";
import { ContractDeployForm } from "../contract-components/contract-deploy-form";
import { ShareButton } from "../share-buttom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PublishWithVersionPageProps {
  author: string;
  contractName: string;
  version: string;
  isDeploy: boolean;
}

export const PublishWithVersionPage: React.FC<PublishWithVersionPageProps> = ({
  author,
  contractName,
  version: _version,
  isDeploy,
}) => {
  const ensQuery = useEns(author);
  const allVersions = useAllVersions(
    ensQuery.data?.address || undefined,
    contractName,
  );

  const availableVersions = allVersions.data?.map(({ version: v }) => v) || [];
  const version = _version || availableVersions[0];
  const trackEvent = useTrack();
  const router = useRouter();

  const publishedContract = useMemo(() => {
    return (
      allVersions.data?.find((v) => v.version === version) ||
      allVersions.data?.[0]
    );
  }, [allVersions?.data, version]);

  const deployContractId = publishedContract?.metadataUri.replace(
    "ipfs://",
    "",
  );

  const contractNameDisplay =
    publishedContract?.displayName || publishedContract?.name;

  const header = (
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="flex md:items-center gap-2 flex-col md:flex-row">
        {!isDeploy && (
          <TrackedIconButton
            variant="ghost"
            as={Link}
            // always send back to explore page
            href="/explore"
            icon={<Icon boxSize="66%" as={FiChevronLeft} />}
            category="release"
            label="back_button"
            aria-label="Back"
            className="self-start md:self-auto -translate-x-3 md:translate-x-0"
          />
        )}

        <div className="flex gap-1 items-center">
          {publishedContract?.logo && (
            <img
              className="shrink-0 rounded-full size-14 hidden md:block"
              alt={publishedContract.name}
              src={replaceIpfsUrl(publishedContract.logo)}
            />
          )}

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {contractNameDisplay}
            </h1>
            <p className="text-muted-foreground text-sm">
              {publishedContract?.description}
            </p>
          </div>
        </div>
      </div>
      <div>
        <Flex gap={3}>
          <Select
            value={version}
            onValueChange={(val) => {
              if (availableVersions.includes(val)) {
                trackEvent({
                  category: "release-selector",
                  action: "click",
                  version_selected: val,
                });

                const pathName =
                  val === allVersions.data?.[0].version
                    ? `/${author}/${contractName}`
                    : `/${author}/${contractName}/${val}`;

                if (isDeploy) {
                  router.push(`${pathName}/deploy`);
                } else {
                  router.push(pathName);
                }
              }
            }}
          >
            <SelectTrigger className="min-w-[180px] bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableVersions.map((v, idx) => {
                return (
                  <SelectItem value={v} key={v}>
                    {v}
                    {idx === 0 && (
                      <span className="text-muted-foreground"> (latest) </span>
                    )}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {isDeploy ? (
            <div className="flex gap-2 items-center">
              <Button asChild variant="outline" className="gap-2">
                <Link
                  href={`${router.asPath.replace("/deploy", "")}`}
                  target="_blank"
                >
                  Contract Details
                  <ExternalLinkIcon className="size-4 text-muted-foreground" />
                </Link>
              </Button>

              <ShareButton title={`Deploy ${contractNameDisplay}`} />
            </div>
          ) : (
            <>
              {deployContractId && (
                <Button asChild variant="primary" className="gap-2">
                  <Link href={`${router.asPath}/deploy`}>
                    Deploy Now
                    <ChevronsRightIcon className="size-4" />
                  </Link>
                </Button>
              )}
            </>
          )}
        </Flex>
      </div>
    </div>
  );

  if (isDeploy) {
    if (!deployContractId || !publishedContract) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <Spinner className="size-4" />
        </div>
      );
    }

    return (
      <div>
        <div className="pb-6 border-b border-border md:pt-8 md:pb-10 md:sticky top-0 bg-background z-10">
          {header}
        </div>
        <div className="pt-6 md:pt-10">
          <ContractDeployForm
            contractId={deployContractId}
            version={publishedContract.version || "latest"}
          />
        </div>
      </div>
    );
  }

  return (
    <Flex direction="column" gap={{ base: 6, md: 10 }}>
      <div className="py-2 md:pt-8 md:pb-0">{header}</div>
      <SimpleGrid columns={12} gap={{ base: 6, md: 10 }} w="full">
        <GridItem colSpan={12} display={{ base: "inherit", md: "none" }}>
          <Divider />
        </GridItem>
        {publishedContract && (
          <PublishedContract
            contract={publishedContract}
            walletOrEns={author}
          />
        )}
      </SimpleGrid>
    </Flex>
  );
};
