import Link from "next/link";
import { Suspense } from "react";
import {
  ContractCard,
  ContractCardSkeleton,
} from "@/components/contracts/contract-card/contract-card";
import type { ExploreCategory } from "../../data";

export function ContractRow({
  category,
  prefixCard,
}: {
  category: ExploreCategory;
  prefixCard?: React.ReactNode;
}) {
  return (
    <section>
      {/* Title, Description + View all link */}
      <div className="flex items-center justify-between gap-4">
        <header className="flex flex-col gap-1">
          <h2 className="font-semibold text-2xl tracking-tight">
            {category.displayName || category.name}
          </h2>

          {(category.description || category.learnMore) && (
            <p className="text-muted-foreground">
              {category.description}{" "}
              {category.learnMore && (
                <Link
                  className="inline text-link-foreground"
                  href={category.learnMore}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Learn more
                </Link>
              )}
            </p>
          )}
        </header>
      </div>

      <div className="h-5" />

      <div className="relative z-0 grid grid-cols-1 gap-4 md:grid-cols-3">
        {prefixCard}
        {category.contracts.map((publishedContractId) => {
          const publisher: string | undefined = Array.isArray(
            publishedContractId,
          )
            ? publishedContractId[0].split("/")[0]
            : publishedContractId.split("/")[0];
          const contractId: string | undefined = Array.isArray(
            publishedContractId,
          )
            ? publishedContractId[0].split("/")[1]
            : publishedContractId.split("/")[1];
          const modules = Array.isArray(publishedContractId)
            ? publishedContractId[1]
            : undefined;
          const overrides = Array.isArray(publishedContractId)
            ? publishedContractId[2]
            : undefined;

          if (!publisher || !contractId) {
            return null;
          }
          return (
            <Suspense
              fallback={<ContractCardSkeleton />}
              key={publisher + contractId + overrides?.title}
            >
              <ContractCard
                contractId={contractId}
                descriptionOverride={overrides?.description}
                isBeta={category.isBeta}
                modules={
                  modules?.length
                    ? modules.map((m) => ({
                        moduleId: m.split("/")[1] || "",
                        publisher: m.split("/")[0] || "",
                      }))
                    : undefined
                }
                publisher={publisher}
                titleOverride={overrides?.title}
              />
            </Suspense>
          );
        })}
      </div>
    </section>
  );
}
