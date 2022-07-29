import { ExampleItem, exampleCategories } from "./ExampleItem";
import { SimpleGrid } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { LinkButton } from "tw-components";

export const ExamplesSection = () => {
  const { trackEvent } = useTrack();
  return (
    <>
      <SimpleGrid
        w="100%"
        columns={{ base: 2, md: 4 }}
        spacing={{ base: 6, md: 24 }}
      >
        {exampleCategories.map((category) => (
          <ExampleItem category={category} key={category} />
        ))}
      </SimpleGrid>
      <LinkButton
        variant="outline"
        borderRadius="md"
        bg="#fff"
        color="#000"
        w="full"
        maxW="container.sm"
        _hover={{
          bg: "whiteAlpha.800",
        }}
        href="https://portal.thirdweb.com/templates"
        isExternal
        p={6}
        onClick={() =>
          trackEvent({
            category: "example",
            action: "click",
            label: "all",
          })
        }
      >
        Explore all templates
      </LinkButton>
    </>
  );
};
