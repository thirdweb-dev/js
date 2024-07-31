import type { ExploreCategory } from "data/explore";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { ContractCard } from "../contract-card";

interface ContractRowProps {
  category: ExploreCategory;
}

export const ContractRow: React.FC<ContractRowProps> = ({ category }) => {
  return (
    <section>
      {/* Title, Description + View all link */}
      <div className="flex items-center justify-between gap-4">
        <header className="flex flex-col gap-1.5">
          <Link href={`/explore/${category.id}`}>
            <h2 className="text-2xl font-semibold tracking-tight">
              {category.displayName || category.name}
            </h2>
          </Link>

          <p className="text-secondary-foreground">
            {category.description}{" "}
            {category.learnMore && (
              <Link
                target="_blank"
                href={category.learnMore}
                className="text-link-foreground inline"
              >
                Learn more
              </Link>
            )}
          </p>
        </header>

        {category.contracts.length > 6 && (
          <Link
            href={`/explore/${category.id}`}
            className="shrink-0 text-link-foreground flex gap-1 items-center text-base hover:text-foreground"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        )}
      </div>

      <div className="h-5" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-0 relative">
        {category.contracts.slice(0, 6).map((publishedContractId, idx) => {
          const [publisher, contractId] = publishedContractId.split("/");
          return (
            <ContractCard
              key={publishedContractId}
              publisher={publisher}
              contractId={contractId}
              tracking={{
                source: category.id,
                itemIndex: `${idx}`,
              }}
              isBeta={category.isBeta}
            />
          );
        })}
      </div>
    </section>
  );
};
