import { Badge } from "@/components/ui/badge";
import { Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import { Card, Heading, LinkButton, Text } from "tw-components";
import type { CreditsRecord } from "./ApplyForOpCreditsModal";

interface PlanCardProps {
  creditsRecord: CreditsRecord;
}

export const PlanCard: React.FC<PlanCardProps> = ({ creditsRecord }) => {
  return (
    <Card as={Flex} justifyContent="space-between" flexDir="column" gap={2}>
      <Flex flexDir="column" gap={2}>
        <div>
          <Badge
            className="font-bold text-white capitalize"
            style={{
              backgroundColor: creditsRecord.color,
            }}
          >
            {creditsRecord.title}
          </Badge>
        </div>
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
