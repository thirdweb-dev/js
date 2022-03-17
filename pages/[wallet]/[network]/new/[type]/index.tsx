import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { Card } from "components/layout/Card";
import { LinkCard } from "components/link-card";
import { FeatureIconMap, TYPE_CONTRACT_MAP } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { ConsolePage } from "pages/_app";
import React from "react";
import { FiChevronLeft } from "react-icons/fi";

const DeployContractType: ConsolePage = () => {
  const wallet = useSingleQueryParam("wallet") || "dashboard";
  const network = useSingleQueryParam("network");
  const type = useSingleQueryParam("type");
  const router = useRouter();

  if (!type || !(type in TYPE_CONTRACT_MAP)) {
    return <div>invalid type</div>;
  }

  return (
    <Card p={10}>
      <Flex direction="column" gap={8}>
        <Flex align="center" justify="space-between">
          <IconButton
            onClick={() => router.back()}
            size="sm"
            aria-label="back"
            icon={<FiChevronLeft />}
          />

          <Heading size="title.lg">What do you want to build?</Heading>
          <Box />
        </Flex>
        <Container maxW="container.md">
          <SimpleGrid columns={2} gap={5}>
            {TYPE_CONTRACT_MAP[type as keyof typeof TYPE_CONTRACT_MAP].map(
              (item) => (
                <LinkCard
                  key={item.title}
                  borderWidth="2px"
                  bg="backgroundCardHighlight"
                  src={FeatureIconMap[item.contractType]}
                  alt={item.title}
                  href={`/${wallet}/${network}/new/${type}/${item.contractType}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  comingSoon={item.comingSoon}
                />
              ),
            )}
          </SimpleGrid>
        </Container>
      </Flex>
    </Card>
  );
};

DeployContractType.Layout = AppLayout;

export default DeployContractType;
