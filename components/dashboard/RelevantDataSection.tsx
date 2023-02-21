import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Heading, Text, TrackedLink } from "tw-components";

interface RelevantDataSectionProps {
  data: {
    title: string;
    url: string;
  }[];
  title: string;
  TRACKING_CATEGORY: string;
}

export const RelevantDataSection: React.FC<RelevantDataSectionProps> = ({
  data,
  title,
  TRACKING_CATEGORY,
}) => {
  const [showAllData, setShowAllData] = useState(false);
  return data.length > 0 ? (
    <Flex direction="column" gap={6}>
      <Heading size="title.sm">Relevant {title}s</Heading>
      <Flex gap={4} direction="column">
        {data.slice(0, showAllData ? undefined : 3).map((item) => (
          <TrackedLink
            category={TRACKING_CATEGORY}
            label={title}
            trackingProps={{
              [title]: item.title.replace(" ", "_").toLowerCase(),
            }}
            isExternal
            fontWeight={500}
            href={item.url}
            key={item.title}
            fontSize="14px"
            color="heading"
            opacity={0.6}
            display="inline-block"
            _hover={{
              opacity: 1,
              textDecoration: "none",
            }}
          >
            {item.title}
          </TrackedLink>
        ))}
        {data.length > 3 && !showAllData ? (
          <Text
            onClick={() => setShowAllData(true)}
            cursor="pointer"
            opacity={0.6}
            color="heading"
            _hover={{ opacity: 1, textDecoration: "none" }}
          >
            View more{" "}
            <Text
              fontWeight="inherit"
              fontSize="inherit"
              color="inherit"
              as="span"
            >
              {"->"}
            </Text>
          </Text>
        ) : null}
      </Flex>
    </Flex>
  ) : null;
};
