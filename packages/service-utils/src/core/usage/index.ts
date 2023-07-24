import { createClient } from "@clickhouse/client";
import type { ClickHouseClient, ClickHouseOptions, UsageInput } from "./types";
import { ServiceName } from "../services";

let clickHouseClient: ClickHouseClient;

export async function usage(
  input: UsageInput<ServiceName>,
  clickHouseOptions: ClickHouseOptions,
) {
  const { serviceScope, ...rest } = input;
  const client = getClient(clickHouseOptions);

  const values = [
    {
      id: "generateUUIDv4()",
      ...rest,
      createdAt: "now()",
    },
  ];

  client.insert({
    table: `${serviceScope}Usage`,
    values,
    format: "JSONEachRow",
  });
}

function getClient(options: ClickHouseOptions) {
  if (clickHouseClient) {
    return clickHouseClient;
  }

  clickHouseClient = createClient({
    application: "thirdweb-dev/service-utils/clickhouse-js",
    host: options.host,
    database: options.name,
    username: options.user,
    password: options.password,
  });

  return clickHouseClient;
}
