import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ContractCard } from "components/explore/contract-card";
import { DeployUpsellCard } from "components/explore/upsells/deploy-your-own";
import { ALL_CATEGORIES, getCategory } from "data/explore";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ExploreCategoryPageProps = {
  params: {
    category: string;
  };
};

export const metadata: Metadata = {
  title: "Explore | Smart Contracts",
  description:
    "Browse a large collection of ready-to-deploy contracts that have been built by thirdweb and other contract developers. Find a contract for your specific app's or game's needs.",
  openGraph: {
    title: "thirdweb Explore: Smart Contracts & Protocols",
  },
};

export async function generateMetadatra(
  props: ExploreCategoryPageProps,
): Promise<Metadata> {
  const category = getCategory(props.params.category);
  if (!category) {
    notFound();
  }
  return {
    title: `${category.name} Smart Contracts | Explore`,
    description: `${category.description} Deploy with one click to Ethereum, Polygon, Optimism, and other EVM blockchains with thirdweb.`,
  };
}

export default async function ExploreCategoryPage(
  props: ExploreCategoryPageProps,
) {
  const category = getCategory(props.params.category);
  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <Breadcrumb className="py-4 px-6 border-b border-border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/explore">Explore</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {category.displayName || category.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container py-8 flex flex-col gap-4">
        <h1 className="mb-3 text-3xl lg:text-5xl font-bold tracking-tighter">
          {category.displayName || category.name}
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground max-w-screen-md">
          {category.description}{" "}
          {category.learnMore && (
            <Link href={category.learnMore}>Learn more</Link>
          )}
        </p>
        <div className="h-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {category.contracts.map((publishedContractId, idx) => {
            const publisher: string = Array.isArray(publishedContractId)
              ? publishedContractId[0].split("/")[0]
              : publishedContractId.split("/")[0];
            const contractId: string = Array.isArray(publishedContractId)
              ? publishedContractId[0].split("/")[1]
              : publishedContractId.split("/")[1];
            const modules = Array.isArray(publishedContractId)
              ? publishedContractId[1]
              : undefined;
            const overrides = Array.isArray(publishedContractId)
              ? publishedContractId[2]
              : undefined;
            return (
              <ContractCard
                key={publisher + contractId + overrides?.title}
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
                        publisher: m.split("/")[0],
                        moduleId: m.split("/")[1],
                      }))
                    : undefined
                }
              />
            );
          })}
        </div>

        <div className="h-16" />
        {/* TODO: remove this once we update the deploy upsell card */}
        <ChakraProviderSetup>
          <DeployUpsellCard />
        </ChakraProviderSetup>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return ALL_CATEGORIES.map((category) => ({
    params: { category },
  }));
}
