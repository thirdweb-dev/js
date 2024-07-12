import type { Metadata } from "next";
import {
  type SimulateTransactionResult,
  TransactionSimulator,
} from "./components/TransactionSimulator";

export const metadata: Metadata = {
  title: "thirdweb Transaction Simulator",
  description:
    "Simulate any EVM transaction. Get gas estimates and onchain error messages to debug your contract calls.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SimulateTransactionResult;
}) {
  return <TransactionSimulator searchParams={searchParams} />;
}
