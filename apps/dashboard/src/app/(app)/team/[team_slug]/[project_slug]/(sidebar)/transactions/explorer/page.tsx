import { TryItOut } from "../server-wallets/components/try-it-out";
import { Scalar } from "./components/scalar";

export default async function TransactionsExplorerPage() {
  return (
    <div className="flex flex-col gap-4">
      <TryItOut />
      <Scalar />
    </div>
  );
}
