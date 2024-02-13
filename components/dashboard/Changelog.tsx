import { Flex } from "@chakra-ui/react";
import { formatDistance } from "date-fns/formatDistance";
import { Link, Text } from "tw-components";
import { BsArrowRight } from "react-icons/bs";

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
        borderColor="#24262D"
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
            color="#24262D"
            _light={{
              color: "gray.300",
            }}
            size="body.xl"
          >
            &#9679;
          </Text>
          <Flex flexDir="column">
            <Link
              isExternal
              _hover={{
                _light: { color: "blue.600" },
                _dark: { color: "blue.400" },
                textDecor: "underline",
              }}
              href={`${item.url}?utm_source=thirdweb&utm_campaign=changelog`}
              role="group"
            >
              <Text color="inherit" noOfLines={2}>
                {item.title}
              </Text>
            </Link>
            <Text color="faded" size="body.sm">
              {formatDistance(new Date(item.published_at), Date.now(), {
                addSuffix: true,
              })}
            </Text>
          </Flex>
        </Flex>
      ))}
      <Link
        href="https://blog.thirdweb.com/changelog?utm_source=thirdweb&utm_campaign=changelog"
        isExternal
        ml={7}
        _hover={{ textDecor: "none", color: "blue.500" }}
        role="group"
        color="faded"
        display="flex"
        alignItems={"center"}
        gap="0.5em"
      >
        View all changes <BsArrowRight />
      </Link>
    </Flex>
  );
};
