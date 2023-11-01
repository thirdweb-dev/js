import {
  Flex,
  Icon,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Card, Text, Heading } from "tw-components";
import { EngineHostingOptionsCta } from "./hosting-options-cta";

interface NoEngineInstanceProps {
  disclosure: UseDisclosureReturn;
}

export const NoEngineInstance: React.FC<NoEngineInstanceProps> = ({
  disclosure,
}) => {
  return (
    <>
      <LinkBox my={6}>
        <Card
          p={10}
          _hover={{
            borderColor: "blue.500",
          }}
          transitionDuration="200ms"
          bgColor="backgroundHighlight"
          borderColor="#0000"
        >
          <Stack spacing={4}>
            <LinkOverlay href="#" onClick={disclosure.onOpen}>
              <Flex align="center" gap={2}>
                <Image
                  src="/assets/engine/cloud-icon.png"
                  alt="cloud icon"
                  w={8}
                />
                <Heading size="title.sm">Add my Engine instance</Heading>
                <Icon as={FiArrowRight} boxSize={6} />
              </Flex>
            </LinkOverlay>

            <Text>
              Manage Engine by providing the URL to your running Engine
              instance.
            </Text>
          </Stack>
        </Card>
      </LinkBox>

      <EngineHostingOptionsCta />
    </>
  );
};
