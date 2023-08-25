import { Flex, SimpleGrid } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Heading } from "tw-components";
import { NavigationCard } from "components/dashboard/NavigationCard";
import { InfrastructureSidebar } from "core-ui/sidebar/infrastructure";

const TRACKING_CATEGORY = "dashboard-infrastructure";

const SECTIONS = [
  {
    title: "Storage",
    description:
      "Store and retrieve files from decentralized storage at high speed.",
    image: require("public/assets/dashboard/home-storage.png"),
    href: "/dashboard/infrastructure/storage",
  },
  {
    title: "RPC Edge",
    description:
      "Connect to over 900 networks with a fast and reliable RPC Edge service.",
    image: require("public/assets/dashboard/home-rpc.png"),
    href: "/dashboard/infrastructure/rpc-edge",
  },
];

const DashboardInfrastructure: ThirdwebNextPage = () => {
  return (
    <Flex
      flexDir="column"
      gap={12}
      mt={{ base: 2, md: 6 }}
      w={{ base: "100%", xl: "70%" }}
    >
      <Flex flexDir="column" gap={4}>
        <Heading size="title.lg">Infrastructure</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {SECTIONS.map(({ title, description, image, href }) => (
            <NavigationCard
              key={title}
              title={title}
              description={description}
              image={image}
              href={href}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

DashboardInfrastructure.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <InfrastructureSidebar activePage="overview" />
    {page}
  </AppLayout>
);

DashboardInfrastructure.pageId = PageId.DashboardInfrastructure;

export default DashboardInfrastructure;
