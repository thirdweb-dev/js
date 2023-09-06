import { ContractCard } from "../contract-card";
import { Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { ExploreCategory } from "data/explore";
import { FiArrowRight } from "react-icons/fi";
import { Heading, Link, LinkButton } from "tw-components";

interface ContractRowProps {
  category: ExploreCategory;
}

export const ContractRow: React.FC<ContractRowProps> = ({ category }) => {
  return (
    <Flex gap={5} direction="column" as="section">
      <Flex align="center" justify="space-between" gap={4}>
        <Flex gap={2} direction="column" as="header">
          <Link href={`/explore/${category.id}`}>
            <Heading as="h2" size="label.xl">
              {category.displayName || category.name}
            </Heading>
          </Link>
          <Flex align="center" gap={1}>
            <Heading as="h3" size="label.md" fontWeight={400}>
              {category.description}{" "}
              {category.learnMore && (
                <Link
                  _light={{
                    color: "blue.500",
                    _hover: { color: "blue.500" },
                  }}
                  _dark={{ color: "blue.400", _hover: { color: "blue.500" } }}
                  isExternal
                  href={category.learnMore}
                >
                  Learn more
                </Link>
              )}
            </Heading>
          </Flex>
        </Flex>
        {category.contracts.length > 6 && (
          <LinkButton
            flexShrink={0}
            size="sm"
            rightIcon={<Icon as={FiArrowRight} />}
            variant="link"
            href={`/explore/${category.id}`}
            fontWeight={500}
            _dark={{
              color: "blue.400",
              _hover: {
                color: "blue.500",
              },
            }}
            _light={{
              color: "blue.500",
              _hover: {
                color: "blue.500",
              },
            }}
          >
            View all
          </LinkButton>
        )}
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
        {category.contracts.slice(0, 6).map((publishedContractId, idx) => {
          const [publisher, contractId] = publishedContractId.split("/");
          return (
            <ContractCard
              key={publishedContractId}
              publisher={publisher}
              contractId={contractId}
              tracking={{
                source: category.id,
                itemIndex: `${idx}`,
              }}
            />
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};
