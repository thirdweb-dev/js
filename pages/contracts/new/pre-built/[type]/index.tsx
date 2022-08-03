import { Box, Container, Flex, IconButton, SimpleGrid } from "@chakra-ui/react";
import { ContractType } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { LinkCard } from "components/link-card";
import { FeatureIconMap, TYPE_CONTRACT_MAP } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React, { ReactElement } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { Card, Heading, LinkButton } from "tw-components";

export default function DeployContractType() {
  const type = useSingleQueryParam("type");
  const { trackEvent } = useTrack();

  if (!type || !(type in TYPE_CONTRACT_MAP)) {
    return <div>invalid type</div>;
  }

  return (
    <Card px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
      <Flex direction="column" gap={8}>
        <Flex align="center" justify="space-between">
          <IconButton
            as={LinkButton}
            href="/contracts"
            size="sm"
            aria-label="back"
            icon={<FiChevronLeft />}
          />

          <Heading size="title.lg">What do you want to build?</Heading>
          <Box />
        </Flex>
        <Container maxW="container.md">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 3, md: 5 }}>
            {TYPE_CONTRACT_MAP[type as keyof typeof TYPE_CONTRACT_MAP].map(
              (item) => (
                <LinkCard
                  key={item.title}
                  borderWidth="2px"
                  bg="backgroundCardHighlight"
                  src={FeatureIconMap[item.contractType as ContractType]}
                  alt={item.title}
                  href={`/contracts/new/pre-built/${type}/${item.contractType}`}
                  title={item.title}
                  subtitle={item.description}
                  comingSoon={item.comingSoon}
                  erc={item.erc}
                  audit={item.audit}
                  onClick={() =>
                    trackEvent({
                      category: "ftux",
                      action: "click",
                      label: "step-2",
                      type,
                      contractType: item.contractType,
                    })
                  }
                />
              ),
            )}
          </SimpleGrid>
        </Container>
      </Flex>
    </Card>
  );
}

DeployContractType.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
