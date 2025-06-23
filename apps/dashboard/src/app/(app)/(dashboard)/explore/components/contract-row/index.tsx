import type { ExploreCategory } from "@app/(dashboard)/explore/data";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import {
  ContractCard,
  ContractCardSkeleton,
} from "../../../../../../@/components/contracts/contract-card";

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
                className="inline text-link-foreground"
                href={category.learnMore}
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </Link>
            )}
          </p>
        </header>

        {category.contracts.length > 6 && (
          <Link
            className="flex shrink-0 items-center gap-1 text-base text-link-foreground hover:text-foreground"
            href={`/explore/${category.id}`}
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        )}
      </div>

      <div className="h-5" />

      <div className="relative z-0 grid grid-cols-1 gap-4 md:grid-cols-3">
        {category.contracts.slice(0, 6).map((publishedContractId) => {
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
