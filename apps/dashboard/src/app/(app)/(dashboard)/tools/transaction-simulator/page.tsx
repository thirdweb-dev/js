import type { Metadata } from "next";
import {
  type SimulateTransactionForm,
  TransactionSimulator,
} from "./components/TransactionSimulator";

export const metadata: Metadata = {
  description:
    "Simulate any EVM transaction. Get gas estimates and onchain error messages to debug your contract calls.",
  title: "thirdweb Transaction Simulator",
};

export default async function Page(props: {
  searchParams: Promise<Partial<SimulateTransactionForm>>;
}) {
  return <TransactionSimulator searchParams={await props.searchParams} />;
}
