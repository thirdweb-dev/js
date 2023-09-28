import { CopyApiKeyButton } from "./CopyButton";
import { ApiKeyDrawer } from "./KeyDrawer";
import { HIDDEN_SERVICES } from "./validations";
import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { HStack, useDisclosure } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ServiceName, getServiceByName } from "@thirdweb-dev/service-utils";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { useState } from "react";
import { Badge, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface ApiKeyTableProps {
  keys: ApiKey[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<ApiKey>();

export const ApiKeyTable: ComponentWithChildren<ApiKeyTableProps> = ({
  keys,
  isLoading,
  isFetched,
}) => {
  const [activeKey, setActiveKey] = useState<ApiKey>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => <Text>{cell.getValue()}</Text>,
    }),

    columnHelper.accessor("key", {
      header: "Client ID",
      cell: (cell) => (
        <CopyApiKeyButton apiKey={cell.getValue()} label="API Key" />
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
          return;
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
          <HStack alignItems="flex-start" w="full">
            {value.map((srv) => {
              const service = getServiceByName(srv.name as ServiceName);
              return !HIDDEN_SERVICES.includes(service?.name) ? (
                <Badge
                  key={srv.name}
                  textTransform="capitalize"
                  colorScheme="blue"
                  px={2}
                  rounded="md"
                >
                  {service?.title}
                </Badge>
              ) : null;
            })}
          </HStack>
        );
      },
    }),
  ];

  const handleOpen = (apiKey: ApiKey) => {
    setActiveKey(apiKey);
    onOpen();
  };

  const handleClose = () => {
    onClose();
    setActiveKey(undefined);
  };

  return (
    <>
      {activeKey && (
        <ApiKeyDrawer
          open={isOpen}
          onClose={handleClose}
          apiKey={activeKey}
          onSubmit={setActiveKey}
        />
      )}

      <TWTable
        title="api key"
        columns={columns}
        data={keys}
        isLoading={isLoading}
        isFetched={isFetched}
        onRowClick={handleOpen}
      />
    </>
  );
};
