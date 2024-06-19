import { Box, Center, Flex, useBreakpointValue } from "@chakra-ui/react";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { useTrack } from "hooks/analytics/useTrack";
import NextImage, { StaticImageData } from "next/image";
import { IoGameControllerOutline } from "react-icons/io5";
import {
  Button,
  Card,
  Heading,
  Link,
  Text,
  TrackedIconButton,
} from "tw-components";

type Game = {
  id: string;
  name: string;
  description: string;
  href: string;
  github: string;
  image: StaticImageData;
};

interface GameCardProps {
  game: Game;
  setSelectedGame: (game: string) => void;
}

const TRACK_CATEGORY = "game_template_card";

export const GameCard: React.FC<GameCardProps> = ({
  game,
  setSelectedGame,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const track = useTrack();
  return (
    <Card
      bg="rgba(0,0,0,.5)"
      boxShadow="lg"
      _hover={{ boxShadow: "dark-lg" }}
      transition="box-shadow .2s ease-in-out"
      borderWidth="0px"
      p={0}
      as={Flex}
      overflow="hidden"
      gap={4}
      flexDir="column"
      role="group"
      cursor="pointer"
      onClick={() => {
        if (isMobile) {
          window.open(game.href, "_blank");
        } else {
          setSelectedGame(game.href);
        }
        track({
          category: TRACK_CATEGORY,
          action: "play_game",
          label: game.id,
        });
      }}
    >
      <Box position="relative">
        <NextImage
          src={game.image}
          placeholder="blur"
          alt=""
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
        <Center position="absolute" top={0} bottom={0} left={0} right={0}>
          <Button
            leftIcon={<IoGameControllerOutline />}
            color="white"
            bg="rgba(0,0,0,.5)"
            _groupHover={{ bg: "rgba(0,0,0,.9)" }}
            transition="background .2s ease-in-out"
          >
            Play Game
          </Button>
        </Center>
      </Box>

      <Flex direction="column" gap={2} pb={4} px={4}>
        <Heading as="h3" size="title.sm">
          {game.name}
        </Heading>
        <Text>{game.description}</Text>
        <Flex justify="flex-end">
          <TrackedIconButton
            as={Link}
            onClick={(e) => {
              e.stopPropagation();
            }}
            size="sm"
            variant="ghost"
            icon={<SiGithub />}
            aria-label="GitHub"
            category={TRACK_CATEGORY}
            label={game.id}
            href={game.github}
            isExternal
          />
        </Flex>
      </Flex>
    </Card>
  );
};
