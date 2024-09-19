import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Badge } from "@/components/ui/badge";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { createColumnHelper } from "@tanstack/react-table";
import {
  type ServiceName,
  getServiceByName,
} from "@thirdweb-dev/service-utils";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns/format";
import { useRouter } from "next/router";
import { Text } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";
import { useTrack } from "../../../hooks/analytics/useTrack";
import { HIDDEN_SERVICES } from "./validations";

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
  const trackEvent = useTrack();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => <p className="py-3 text-foreground">{cell.getValue()}</p>,
    }),

    columnHelper.accessor("key", {
      header: "Client ID",
      cell: (cell) => (
        <CopyTextButton
          textToCopy={cell.getValue()}
          copyIconPosition="right"
          textToShow={`${cell.getValue().slice(0, 5)}...${cell.getValue().slice(-5)}`}
          tooltip="Copy Client ID"
          variant="ghost"
          className="font-mono text-muted-foreground -translate-x-2"
          onClick={() => {
            trackEvent({
              category: "api_key_button",
              action: "copy",
              apiKey: cell.getValue(),
              label: "Client ID",
            });
          }}
        />
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
          return <p className="text-muted-foreground"> Never </p>;
        }

        const createdDate = format(new Date(value), "MMM dd, yyyy");
        return <p className="text-muted-foreground">{createdDate}</p>;
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
          <div className="flex flex-col xl:flex-row items-start gap-2">
            {value.map((srv) => {
              const service = getServiceByName(srv.name as ServiceName);
              return !HIDDEN_SERVICES.includes(service?.name) ? (
                <Badge variant="default" key={srv.name}>
                  {service?.title}{" "}
                </Badge>
              ) : null;
            })}
          </div>
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
      bodyRowClassName="hover:bg-muted/50"
    />
  );
};
