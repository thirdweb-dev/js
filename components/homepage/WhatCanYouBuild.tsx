import {
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useState } from "react";

type BuildTab = "membership" | "marketplace" | "dao" | "collection" | "games";

export const WhatCanYouBuild: React.FC = () => {
  const [tab, setTab] = useState<BuildTab>("membership");

  return (
    <Flex
      id="whatcanyoubuild"
      direction="column"
      title="What can you build?"
      pb="-100px"
    >
      <Container
        maxW="container.page"
        position="relative"
        pt={["75px", "75px", "150px"]}
      >
        <Flex w="100%" align="center" direction="column" position="relative">
          <Flex
            maxW="container.lg"
            px={0}
            pb={36}
            alignItems="center"
            direction="column"
          >
            <Heading
              w="100%"
              as="h2"
              mb="48px"
              textAlign="center"
              size="display.md"
            >
              What can you build?
            </Heading>

            <Stack display={{ base: "flex", md: "none" }} width="90vw">
              <Tabs tab={tab} setTab={setTab} />
            </Stack>

            <Flex align="center" display={{ base: "none", md: "flex" }}>
              <Stack width="330px">
                <Tabs tab={tab} setTab={setTab} />
              </Stack>

              <ChakraNextImage
                border="2px solid #EAEAEA"
                borderRadius="21px"
                ml="32px"
                alt=""
                w={{ md: "420px", lg: "620px", xl: "770px" }}
                placeholder="empty"
                src={
                  tab === "membership"
                    ? require("/public/assets/landingpage/membership.png")
                    : tab === "marketplace"
                    ? require("/public/assets/landingpage/marketplace.png")
                    : tab === "dao"
                    ? require("/public/assets/landingpage/dao.png")
                    : tab === "collection"
                    ? require("/public/assets/landingpage/pfp.png")
                    : require("/public/assets/landingpage/games.png")
                }
              />
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

interface ITabs {
  tab: string;
  setTab: (tab: BuildTab) => void;
}

const Tabs: React.FC<ITabs> = ({ tab, setTab }) => {
  return (
    <>
      <Divider />
      <Tab
        tab={tab}
        title="Membership NFTs"
        active="membership"
        color="blue.50"
        onClick={() => setTab("membership")}
        description={`Create membership NFTs that grant people access to your communities.`}
      />
      <Divider />
      <Tab
        tab={tab}
        title="Public Marketplaces"
        active="marketplace"
        color="red.50"
        onClick={() => setTab("marketplace")}
        description={`Build your own marketplaces to let users buy and sell digital assets.`}
      />
      <Divider />
      <Tab
        tab={tab}
        title="DAOs"
        active="dao"
        color="purple.50"
        onClick={() => setTab("dao")}
        description={`Start your own fully featured DAO with its own voting system.`}
      />
      <Divider />
      <Tab
        tab={tab}
        title="PFP Collections"
        active="collection"
        color="orange.50"
        onClick={() => setTab("collection")}
        description={`Launch a PFP collection of artwork that people can use for their profiles.`}
      />
      <Divider />
      <Tab
        tab={tab}
        title="Blockchain Games"
        active="games"
        color="green.50"
        onClick={() => setTab("games")}
        description={`Easily create games with digital economies, collectibles, and more.`}
      />
      <Divider />
    </>
  );
};

interface IBuildTab {
  title: string;
  description: string;
  tab: string;
  active: string;
  color: string;
  onClick: () => void;
}

const Tab: React.FC<IBuildTab> = ({
  title,
  description,
  tab,
  active,
  color,
  onClick,
}) => {
  if (tab === active) {
    return (
      <Flex
        padding={{ base: "24px", md: "12px", lg: "24px" }}
        borderRadius="md"
        bg={color}
        direction="column"
        height={{ md: "108px", lg: "137px" }}
      >
        <Text
          color="#262A36"
          fontSize={{ base: "20px", lg: "24px" }}
          fontWeight="600"
        >
          {title}
        </Text>
        <Text
          color="rgba(39, 46, 54, 0.9)"
          fontSize={{ base: "14px", lg: "16px" }}
        >
          {description}
        </Text>

        <ChakraNextImage
          border="2px solid #EAEAEA"
          borderRadius="21px"
          mt="32px"
          display={{ base: "block", md: "none" }}
          alt=""
          placeholder="empty"
          src={
            tab === "membership"
              ? require("/public/assets/landingpage/membership.png")
              : tab === "marketplace"
              ? require("/public/assets/landingpage/marketplace.png")
              : tab === "dao"
              ? require("/public/assets/landingpage/dao.png")
              : tab === "collection"
              ? require("/public/assets/landingpage/pfp.png")
              : require("/public/assets/landingpage/games.png")
          }
        />
      </Flex>
    );
  }

  return (
    <Flex
      height={{ base: "48px", lg: "64px" }}
      paddingX={{ base: "12px", lg: "24px" }}
      borderRadius="md"
      align="center"
      onClick={onClick}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
    >
      <Text fontSize={{ base: "20px", lg: "24px" }} fontWeight="600">
        {title}
      </Text>
    </Flex>
  );
};
