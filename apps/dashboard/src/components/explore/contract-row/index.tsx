import type { ExploreCategory } from "data/explore";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ContractCard, ContractCardSkeleton } from "../contract-card";

interface ContractRowProps {
  category: ExploreCategory;
}

export function ContractRow({ category }: ContractRowProps) {
  return (
    <section>
      {/* Title, Description + View all link */}
      <div className="flex items-center justify-between gap-4">
        <header className="flex flex-col gap-1.5">
          <Link href={`/explore/${category.id}`}>
            <h2 className="font-semibold text-2xl tracking-tight">
              {category.displayName || category.name}
            </h2>
          </Link>

          <p className="text-muted-foreground">
            {category.description}{" "}
            {category.learnMore && (
              <Link
                target="_blank"
                href={category.learnMore}
                className="inline text-link-foreground"
              >
                Learn more
              </Link>
            )}
          </p>
        </header>

        {category.contracts.length > 6 && (
          <Link
            href={`/explore/${category.id}`}
            className="flex shrink-0 items-center gap-1 text-base text-link-foreground hover:text-foreground"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        )}
      </div>

      <div className="h-5" />

      <div className="relative z-0 grid grid-cols-1 gap-4 md:grid-cols-3">
        {category.contracts.slice(0, 6).map((publishedContractId, idx) => {
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
              key={publisher + contractId + overrides?.title}
              fallback={<ContractCardSkeleton />}
            >
              <ContractCard
                publisher={publisher}
                contractId={contractId}
                titleOverride={overrides?.title}
                descriptionOverride={overrides?.description}
                tracking={{
                  source: category.id,
                  itemIndex: `${idx}`,
                }}
                isBeta={category.isBeta}
                modules={
                  modules?.length
                    ? modules.map((m) => ({
                        publisher: m.split("/")[0] || "",
                        moduleId: m.split("/")[1] || "",
                      }))
                    : undefined
                }
              />
            </Suspense>
          );
        })}
      </div>
    </section>
  );
}
