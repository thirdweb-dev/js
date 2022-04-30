import { Box, Flex, Link } from "@chakra-ui/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { TransactionButton } from "components/buttons/TransactionButton";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { usePublishMutation } from "components/contract-components/hooks";
import { ContractId } from "components/contract-components/types";
import { UrlMap } from "constants/mappings";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { ConsolePage } from "pages/_app";
import { useEffect, useMemo, useState } from "react";
import { Badge, Heading, Text } from "tw-components";

const ContractsPublishPageWrapped: React.VFC = () => {
  const { Track, trackEvent } = useTrack({
    page: "publish",
  });

  const router = useRouter();

  const ipfsHashes = useMemo(() => {
    const uri = router.query.uri;
    const ipfs = router.query.ipfs;
    let array: string[] = [];
    // handle both ipfs and uri
    if (ipfs) {
      array = Array.isArray(ipfs) ? ipfs : [ipfs];
    } else if (uri) {
      array = (Array.isArray(uri) ? uri : [uri]).map((hash) =>
        hash.replace("ipfs://", ""),
      );
    }
    return array;
  }, [router.query]);

  const [selectedContractIds, setSelectedContractIds] = useState<ContractId[]>(
    [],
  );

  useEffect(() => {
    setSelectedContractIds(ipfsHashes);
  }, [ipfsHashes]);

  const publishContractNo = selectedContractIds.length;

  const { onSuccess, onError } = useTxNotifications(
    `Successfully published ${publishContractNo} contract${
      publishContractNo === 1 ? "" : "s"
    }`,
    "Failed to publish contracts",
  );
  const publishMutation = usePublishMutation();

  const publishableContractIds = useMemo(() => {
    return selectedContractIds.filter((id) => !(id in UrlMap));
  }, [selectedContractIds]);

  const uris = useMemo(() => {
    return selectedContractIds.map((id) =>
      id.startsWith("ipfs://") ? id : `ipfs://${id}`,
    );
  }, [selectedContractIds]);

  return (
    <Track>
      <Flex gap={8} direction="column">
        <Flex gap={2} direction="column">
          <Heading size="title.md">
            Publish Contracts{" "}
            <Badge variant="outline" colorScheme="purple">
              beta
            </Badge>
          </Heading>
          <Text fontStyle="italic" maxW="container.md">
            Publishing contracts lets you make your contracts available to be
            deployed later, across multiple chains. You can even share your
            published contracts with others, letting them deploy instances of
            your contracts.
            <br />
            <Link
              color="primary.500"
              isExternal
              href="https://www.notion.so/thirdweb/Alpha-Custom-Contract-74d81faa569b418f9ed718645fd7df2c"
            >
              Learn more about publishing contracts
            </Link>
          </Text>
        </Flex>

        <DeployableContractTable
          isPublish
          contractIds={ipfsHashes}
          selectable={{
            selected: publishableContractIds,
            onChange: setSelectedContractIds,
          }}
        />

        <Flex justify="space-between">
          <Box />
          <TransactionButton
            colorScheme="primary"
            isDisabled={!publishContractNo}
            transactionCount={1}
            isLoading={publishMutation.isLoading}
            onClick={() => {
              trackEvent({
                category: "publish",
                action: "click",
                label: "attempt",
                uris,
              });
              publishMutation.mutate(uris, {
                onSuccess: () => {
                  onSuccess();
                  trackEvent({
                    category: "publish",
                    action: "click",
                    label: "success",
                    uris,
                  });
                  router.push(`/contracts`);
                },
                onError: (err) => {
                  onError(err);
                  trackEvent({
                    category: "publish",
                    action: "click",
                    label: "error",
                    uris,
                  });
                },
              });
            }}
          >
            Publish {publishContractNo} contract
            {publishContractNo === 1 ? "" : "s"}
          </TransactionButton>
        </Flex>
      </Flex>
    </Track>
  );
};

const ContractsPublishPage: ConsolePage = () => {
  return (
    <CustomSDKContext desiredChainId={ChainId.Mumbai}>
      <ContractsPublishPageWrapped />
    </CustomSDKContext>
  );
};

ContractsPublishPage.Layout = AppLayout;

export default ContractsPublishPage;
