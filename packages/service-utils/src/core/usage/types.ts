import type { InsertParams, InsertResult } from "@clickhouse/client";
import type { ServiceName } from "../services";

export type ClickHouseClient = {
  insert(params: InsertParams): Promise<InsertResult>;
};

export type ClickHouseOptions = {
  host: string;
  password: string;
  name: string;
  user: string;
};

type BaseUsageInput = {
  serviceScope: ServiceName;
  accountId: string;
  clientId: string;
  walletAddress: string;
};

export type BundlerUsageInput = BaseUsageInput & {
  serviceScope: "bundler";
  method: string;
  chainId: number;
  meta: {};
};

export type PaymasterUsageInput = BaseUsageInput & {
  serviceScope: "bundler";
  method: string;
  chainId: number;
  gasSpent: number;
  meta: {};
};

export type UsageInput<T extends ServiceName> = T extends "bundler"
  ? BundlerUsageInput
  : T extends "relayer"
  ? PaymasterUsageInput
  : never;
