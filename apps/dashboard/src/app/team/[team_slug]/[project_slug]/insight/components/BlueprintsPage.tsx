import { type Blueprint, BlueprintsExplorer } from "./BlueprintsExplorer";
import { BlueprintsPageHeader } from "./BlueprintsPageHeader";

export function BlueprintsPage() {
  return (
    <div>
      <BlueprintsPageHeader />
      <div className="h-6" />
      <BlueprintsPageContent />
    </div>
  );
}

function getProjectBlueprints() {
  return [
    {
      id: "1",
      name: "Transactions",
      slug: "transactions-blueprint",
      description: "Query transaction data",
    },
    {
      id: "2",
      name: "Events",
      slug: "events-blueprint",
      description: "Query event data",
    },
    {
      id: "3",
      name: "Tokens",
      slug: "tokens-blueprint",
      description: "Query ERC-20, ERC-721, and ERC-1155 tokens",
    },
  ] as Blueprint[];
}

function BlueprintsPageContent() {
  const blueprints = getProjectBlueprints();

  return <BlueprintsExplorer blueprints={blueprints} />;
}
