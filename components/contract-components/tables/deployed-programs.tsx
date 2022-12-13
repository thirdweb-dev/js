import { useAllProgramsList } from "@3rdweb-sdk/react";
import { Flex } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ChakraNextImage } from "components/Image";
import { TWTable } from "components/shared/TWTable";
import { FeatureIconMap } from "constants/mappings";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Badge, Heading, LinkButton, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { SupportedSolanaNetworkToUrlMap } from "utils/network";

interface DeployedProgramsProps {
  noHeader?: true;
  programListQuery: ReturnType<typeof useAllProgramsList>;
  limit?: number;
}

const columnHelper =
  createColumnHelper<ReturnType<typeof useAllProgramsList>["data"][number]>();

const columns = [
  columnHelper.accessor("programName", {
    header: "Name",
    cell: (info) => <Heading size="label.md">{info.getValue()}</Heading>,
  }),

  columnHelper.accessor("programType", {
    header: "Program Type",
    cell: (info) => (
      <Flex align="center" gap={2}>
        <ChakraNextImage
          src={FeatureIconMap[info?.getValue() as keyof typeof FeatureIconMap]}
          alt={info?.getValue()?.toString()}
          boxSize={8}
        />
        <Text size="label.md" textTransform="capitalize">
          {info
            ?.getValue()
            ?.toString()
            ?.split("-")
            ?.join(" ")
            ?.replace("nft", "NFT")}
        </Text>
      </Flex>
    ),
  }),
  columnHelper.accessor("programAddress", {
    header: "Address",
    cell: (info) => <AddressCopyButton address={info.getValue()} />,
  }),
  columnHelper.accessor("network", {
    cell: (info) => {
      const val = info.getValue();
      return (
        <Flex align="center" gap={2}>
          <Badge
            size="label.sm"
            variant="subtle"
            colorScheme={val === "devnet" ? "yellow" : "green"}
          >
            {val}
          </Badge>
        </Flex>
      );
    },
  }),
];

export const DeployedPrograms: React.FC<DeployedProgramsProps> = ({
  noHeader,
  programListQuery,
  limit = 50,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (
      programListQuery.isFetched &&
      programListQuery.data.length === 0 &&
      router.asPath === "/dashboard"
    ) {
      router.replace("/programs");
    }
  }, [programListQuery, router]);

  return (
    <>
      {!noHeader && (
        <Flex
          justify="space-between"
          align="top"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Flex gap={2} direction="column">
            <Heading size="title.md">Deployed programs</Heading>
            <Text fontStyle="italic" maxW="container.md">
              The list of programs that you have deployed with thirdweb across
              mainnet and devnet.
            </Text>
          </Flex>
          <LinkButton
            leftIcon={<FiPlus />}
            colorScheme="primary"
            href="/programs"
          >
            Deploy new program
          </LinkButton>
        </Flex>
      )}

      <TWTable
        columns={columns}
        data={programListQuery.data}
        isLoading={programListQuery.isLoading}
        isFetched={programListQuery.isFetched}
        showMore={{ pageSize: limit }}
        onRowClick={(row) => {
          router.push(
            `/${SupportedSolanaNetworkToUrlMap[row.network]}/${
              row.programAddress
            }`,
            undefined,
            { shallow: true },
          );
        }}
      />
    </>
  );
};
