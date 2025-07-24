import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { THIRDWEB_CLIENT } from "../../../../../lib/client";
import { isProd } from "../../../../../lib/env";
import { BlueprintPlayground } from "../../../../insight/[blueprint_slug]/blueprint-playground.client";
import { getBridgePaths } from "../utils";

export default async function Page(props: {
  searchParams: Promise<{
    route: string;
  }>;
}) {
  const params = await props.searchParams;

  // invalid url
  if (!params.route) {
    redirect("/payments/backend");
  }

  const thirdwebDomain = !isProd ? "thirdweb-dev" : "thirdweb";
  const domain = `https://bridge.${thirdwebDomain}.com`;

  const paths = await getBridgePaths();
  const pathMetadata = paths.find(([path]) => path === params.route)?.[1]?.get;

  // invalid url
  if (!pathMetadata) {
    redirect("/payments/backend");
  }

  const title = pathMetadata.summary || "";
  return (
    <div className="container pb-8">
      <Breadcrumbs />
      <div className="h-3" />
      {title && (
        <h1 className="mb-6 font-semibold text-2xl tracking-tight lg:text-3xl">
          {title}
        </h1>
      )}

      <BlueprintPlayground
        backLink={"/payments/backend"}
        clientId={THIRDWEB_CLIENT.clientId}
        domain={domain}
        key={params.route}
        metadata={pathMetadata}
        path={params.route}
        supportedChainIds={[]}
      />
    </div>
  );
}

function Breadcrumbs() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/payments/backend">
            Payments API
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  );
}
