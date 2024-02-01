import { CopyApiKeyButton } from "./CopyButton";
import { HIDDEN_SERVICES } from "./validations";
import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ServiceName, getServiceByName } from "@thirdweb-dev/service-utils";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { Badge, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface ApiKeysProps {
  keys: ApiKey[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<ApiKey>();

export const ApiKeys: ComponentWithChildren<ApiKeysProps> = ({
  keys,
  isLoading,
  isFetched,
}) => {
  const router = useRouter();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => <Text>{cell.getValue()}</Text>,
    }),

    columnHelper.accessor("key", {
      header: "Client ID",
      cell: (cell) => (
        <CopyApiKeyButton apiKey={cell.getValue()} label="Client ID" />
      ),
    }),

    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: (cell) => {
        const value = cell.getValue();

        if (!value) {
          return;
        }
        const createdDate = format(new Date(value), "MMM dd, yyyy");
        return <Text>{createdDate}</Text>;
      },
    }),

    columnHelper.accessor("lastAccessedAt", {
      header: "Last accessed",
      cell: (cell) => {
        const value = cell.getValue();

        if (!value) {
          return "Never";
        }

        const createdDate = format(new Date(value), "MMM dd, yyyy");
        return <Text>{createdDate}</Text>;
      },
    }),

    columnHelper.accessor("services", {
      header: "Enabled Services",
      cell: (cell) => {
        const value = cell.getValue();
        if (!value || value.length === 0) {
          return <Text>None</Text>;
        }

        return (
          <Flex
            flexDir={{ base: "column", xl: "row" }}
            alignItems="flex-start"
            gap={{ base: 2, xl: 1 }}
          >
            {value.map((srv) => {
              const service = getServiceByName(srv.name as ServiceName);
              return !HIDDEN_SERVICES.includes(service?.name) ? (
                <Badge
                  key={srv.name}
                  textTransform="capitalize"
                  color="blue.500"
                  px={2}
                  rounded="md"
                >
                  {service?.title}
                </Badge>
              ) : null;
            })}
          </Flex>
        );
      },
    }),
  ];

  return (
    <TWTable
      title="api key"
      columns={columns}
      data={keys}
      isLoading={isLoading}
      isFetched={isFetched}
      onRowClick={({ id }) => router.push(`/dashboard/settings/api-keys/${id}`)}
    />
  );
};
