import type { Metadata } from "next";
import {
  type SimulateTransactionForm,
  TransactionSimulator,
} from "./components/TransactionSimulator";

export const metadata: Metadata = {
  title: "thirdweb Transaction Simulator",
  description:
    "Simulate any EVM transaction. Get gas estimates and onchain error messages to debug your contract calls.",
};

export default async function Page(props: {
  searchParams: Promise<Partial<SimulateTransactionForm>>;
}) {
  return <TransactionSimulator searchParams={await props.searchParams} />;
}
