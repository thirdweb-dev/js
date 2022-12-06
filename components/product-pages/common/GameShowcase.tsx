import { Game, GameCard } from "./GameCard";
import { ProductSection } from "./ProductSection";
import {
  AspectRatio,
  Box,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { Heading } from "tw-components";

const games: Game[] = [
  {
    id: "karting",
    name: "3D Racer",
    description:
      "Purchase Vehicle NFTs from an in-game marketplace and start earning ERC20 tokens used to buy upgrades.",
    image: require("public/assets/solutions-pages/gaming/3d-racer.png"),
    href: "https://unity-karting-game.thirdweb-example.com/",
    github: "https://github.com/thirdweb-example/unity-karting-game",
  },
  {
    id: "rpg",
    name: "2D RPG",
    description:
      "Complete quests to earn in-game currency and buy NFTs from a marketplace that you can view in your inventory.",
    image: require("public/assets/solutions-pages/gaming/2d-rpg.png"),
    href: "https://unity-rpg-game.thirdweb-example.com/",
    github: "https://github.com/thirdweb-example/unity-rpg-game",
  },
  {
    id: "lootbox",
    name: "NFT Lootbox",
    description:
      "Purchase NFT loot boxes from a marketplace and open them to reveal randomly selected NFTs inside!",
    image: require("public/assets/solutions-pages/gaming/nft-lootbox.png"),
    href: "https://unity-nft-lootboxes.thirdweb-example.com/",
    github: "https://github.com/thirdweb-example/unity-nft-lootboxes",
  },
];

export const GameShowcase = () => {
  const [selectedGame, setSelectedGame] = useState("");

  return (
    <ProductSection>
      <Flex
        flexDir="column"
        py={{ base: 24, lg: 36 }}
        align="center"
        gap={{ base: 6, lg: 8 }}
      >
        <Heading as="h2" size="display.sm" fontWeight={700} textAlign="center">
          Get started with our templates
        </Heading>
        <Heading
          as="h3"
          maxW="820px"
          textAlign="center"
          color="whiteAlpha.600"
          size="subtitle.md"
        >
          Try out our demo games and start building your own
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, lg: 8 }}>
          {games.map((game) => (
            <GameCard
              key={game.name}
              game={game}
              setSelectedGame={setSelectedGame}
            />
          ))}
        </SimpleGrid>

        <Modal
          isCentered
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame("")}
          size="6xl"
        >
          <ModalOverlay />

          <ModalContent>
            <Box
              position="absolute"
              top={{ base: "-50px", md: "-10px" }}
              right={{ base: "-10px", md: "-50px" }}
            >
              <ModalCloseButton />
            </Box>
            <AspectRatio ratio={{ base: 16 / 9, md: 16 / 9 }} w="100%">
              <Box
                bg="#000"
                borderRadius={{ base: "md", md: "lg" }}
                as="iframe"
                src={selectedGame}
              />
            </AspectRatio>
          </ModalContent>
        </Modal>
      </Flex>
    </ProductSection>
  );
};
