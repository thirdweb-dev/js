import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { THIRDWEB_CLIENT } from "../../../lib/client";
import { isProd } from "../../../lib/env";
import { fetchBlueprintSpec } from "../utils";
import { BlueprintPlayground } from "./blueprint-playground.client";

export default async function Page(props: {
  params: Promise<{
    blueprint_slug: string;
  }>;
  searchParams: Promise<{ path: string }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  // invalid url
  if (!searchParams.path) {
    redirect("/insight");
  }

  const thirdwebDomain = !isProd ? "thirdweb-dev" : "thirdweb";
  const domain = `https://insight.${thirdwebDomain}.com`;

  const [blueprintSpec] = await Promise.all([
    fetchBlueprintSpec({
      blueprintId: params.blueprint_slug,
    }),
  ]);

  const pathMetadata = blueprintSpec.openapiJson.paths[searchParams.path]?.get;

  // invalid url
  if (!pathMetadata) {
    redirect("/insight");
  }

  const supportedChainIds =
    blueprintSpec.openapiJson.servers?.[0]?.variables?.chainId?.enum?.map(
      Number,
    ) || [];

  const title = pathMetadata.summary || "";
  return (
    <div>
      <Breadcrumbs />
      <h1 className="mt-3 mb-6 font-semibold text-2xl tracking-tight lg:text-3xl">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              pathMetadata.deprecated && "text-muted-foreground line-through",
            )}
          >
            {title}
          </span>
          {pathMetadata.deprecated && (
            <Badge variant="destructive" className="text-xs">
              Deprecated
            </Badge>
          )}
        </div>
      </h1>
      {pathMetadata.deprecated && (
        <div className="mt-3 mb-6">
          <div className="flex items-center gap-2">
            <span>{pathMetadata.description}</span>
          </div>
        </div>
      )}
      <BlueprintPlayground
        key={searchParams.path}
        metadata={pathMetadata}
        backLink={"/insight"}
        clientId={THIRDWEB_CLIENT.clientId}
        path={searchParams.path}
        supportedChainIds={supportedChainIds}
        domain={domain}
      />
    </div>
  );
}

function Breadcrumbs() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/insight">Insight Blueprints</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  );
}
