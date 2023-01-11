import { Aurora } from "../Aurora";
import {
  Box,
  Flex,
  LightMode,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { GeneralCta } from "components/shared/GeneralCta";
import { FiCheck } from "react-icons/fi";
import { Heading, Text } from "tw-components";

export const PricingSection = () => {
  return (
    <HomepageSection id="pricing">
      <Aurora
        pos={{ left: "80%", top: "40%" }}
        size={{ width: "1400px", height: "1400px" }}
        color="hsl(289deg 78% 30% / 35%)"
      />

      <SimpleGrid
        py={{ base: 12, lg: 24 }}
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 6, md: 8 }}
        alignItems="center"
      >
        <Flex gap={{ base: 6, md: 8 }} flexDir="column">
          <Heading size="display.sm" textAlign={{ base: "center", md: "left" }}>
            Transparent pricing. No hidden fees.
            <br />
          </Heading>
          <Text
            size="body.xl"
            fontStyle="italic"
            textAlign={{ base: "center", md: "left" }}
            color="whiteAlpha.700"
          >
            We may introduce optional advanced features which you can decide to
            pay for in the future. We will always be transparent and clear about
            any paid features up front.
          </Text>
        </Flex>
        <Box
          p={12}
          borderRadius="lg"
          backgroundColor="#0000004d"
          boxShadow="0 0 0 1px hsl(0deg 0% 100% / 15%)"
        >
          <Heading
            bgGradient="linear(to-r, #FFB8E6, #8689E3)"
            bgClip="text"
            size="display.lg"
            mb={6}
          >
            Free.
          </Heading>
          <List
            spacing={3}
            display="flex"
            flexDirection="column"
            alignItems="start"
            textAlign="left"
            color="whiteAlpha.700"
            mb={16}
          >
            <ListItem>
              <ListIcon as={FiCheck} color="green.500" />
              Zero fees on contract deployments
            </ListItem>
            <ListItem>
              <ListIcon as={FiCheck} color="green.500" />
              Zero fees on transactions
            </ListItem>
            <ListItem>
              <ListIcon as={FiCheck} color="green.500" />
              New features added every week
            </ListItem>
            <ListItem>
              <ListIcon as={FiCheck} color="green.500" />
              Save on gas fees with advanced optimizations
            </ListItem>
          </List>
          <LightMode>
            <GeneralCta title="Start building today" size="lg" w="100%" />
          </LightMode>
        </Box>
      </SimpleGrid>
    </HomepageSection>
  );
};
