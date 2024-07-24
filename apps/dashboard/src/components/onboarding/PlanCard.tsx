import { Box, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import { Badge, Card, Heading, LinkButton, Text } from "tw-components";
import type { CreditsRecord } from "./ApplyForOpCreditsModal";

interface PlanCardProps {
  creditsRecord: CreditsRecord;
}

export const PlanCard: React.FC<PlanCardProps> = ({ creditsRecord }) => {
  return (
    <Card as={Flex} justifyContent="space-between" flexDir="column" gap={2}>
      <Flex flexDir="column" gap={2}>
        <Box>
          <Badge
            borderRadius="full"
            size="label.sm"
            px={3}
            bgColor={creditsRecord.color}
          >
            <Text color="#fff" textTransform="capitalize" fontWeight="bold">
              {creditsRecord.title}
            </Text>
          </Badge>
        </Box>
        <Flex flexDir="column" gap={1}>
          <Text color="faded">{creditsRecord.upTo ? "Up to" : "\u00A0"}</Text>
          <Heading color="bgBlack" size="title.md" fontWeight="extrabold">
            {creditsRecord.credits}
          </Heading>
          <Text letterSpacing="wider" fontWeight="bold" color="faded">
            GAS CREDITS
          </Text>
        </Flex>
        {creditsRecord.features && (
          <UnorderedList>
            {creditsRecord.features.map((feature) => (
              <Text as={ListItem} key={feature} color="faded">
                {feature}
              </Text>
            ))}
          </UnorderedList>
        )}
      </Flex>
      {creditsRecord.ctaTitle && creditsRecord.ctaHref && (
        <LinkButton
          href={creditsRecord.ctaHref}
          colorScheme="blue"
          size="sm"
          variant="outline"
          isExternal
        >
          {creditsRecord.ctaTitle}
        </LinkButton>
      )}
    </Card>
  );
};
