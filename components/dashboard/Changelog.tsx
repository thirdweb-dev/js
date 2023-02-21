import { Flex } from "@chakra-ui/react";
import formatDistance from "date-fns/formatDistance";
import { Link, Text } from "tw-components";

export interface ChangelogItem {
  published_at: string;
  title: string;
  url: string;
}

interface ChangelogProps {
  changelog: ChangelogItem[];
}

export const Changelog: React.FC<ChangelogProps> = ({ changelog }) => {
  return (
    <Flex flexDir="column" gap={4} position="relative">
      <Flex
        position="absolute"
        h="95%"
        borderRight="1px solid"
        borderColor="gray.800"
        _light={{
          borderColor: "gray.300",
        }}
        left={{ base: "5px", md: "6px" }}
        top="15px"
      />
      {changelog.map((item) => (
        <Flex key={item.title} gap={4}>
          <Text
            userSelect="none"
            mt="-5px"
            color="gray.800"
            _light={{
              color: "gray.300",
            }}
            size="body.xl"
          >
            &#9679;
          </Text>
          <Flex flexDir="column">
            <Link
              _hover={{
                _light: { color: "blue.600" },
                _dark: { color: "blue.400" },
                textDecor: "underline",
              }}
              href={item.url}
              role="group"
            >
              <Text color="inherit">{item.title}</Text>
            </Link>
            <Text color="gray.700" size="body.sm">
              {formatDistance(new Date(item.published_at), Date.now(), {
                addSuffix: true,
              })}
            </Text>
          </Flex>
        </Flex>
      ))}
      <Link
        href="https://blog.thirdweb.com/changelog/"
        isExternal
        ml={8}
        _hover={{ textDecor: "none" }}
        role="group"
      >
        <Text color="gray.700" _groupHover={{ color: "blue.500" }}>
          View all changes{" "}
          <Text
            fontWeight="inherit"
            fontSize="inherit"
            color="inherit"
            as="span"
          >
            {"->"}
          </Text>
        </Text>
      </Link>
    </Flex>
  );
};
