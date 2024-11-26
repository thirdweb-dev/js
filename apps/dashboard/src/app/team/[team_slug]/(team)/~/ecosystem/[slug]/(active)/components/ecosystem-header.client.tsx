"use client";
import { CopyButton } from "@/components/ui/CopyButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { TabPathLinks } from "@/components/ui/tabs";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronsUpDown,
  PlusCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { EcosystemWalletStats } from "types/analytics";
import { useEcosystemList } from "../../../hooks/use-ecosystem-list";
import type { Ecosystem } from "../../../types";
import { EcosystemWalletsSummary } from "../analytics/components/Summary";
import { useEcosystem } from "../hooks/use-ecosystem";

function EcosystemAlertBanner({ ecosystem }: { ecosystem: Ecosystem }) {
  switch (ecosystem.status) {
    case "requested": {
      return (
        <Alert variant="info">
          <Spinner className="h-4 w-4" />
          <AlertTitle>Ecosystem spinning up!</AlertTitle>
          <AlertDescription>
            Your payment is being processed and ecosystem is being created.
            Please wait.
          </AlertDescription>
        </Alert>
      );
    }
    case "paymentFailed": {
      return (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Payment failed!</AlertTitle>
          <AlertDescription>
            Your payment failed. Please update your payment method and contact
            support@thirdweb.com
          </AlertDescription>
        </Alert>
      );
    }
    default: {
      return null;
    }
  }
}

function EcosystemSelect(props: {
  ecosystem: Ecosystem;
  ecosystemLayoutPath: string;
}) {
  const { data: ecosystems, isPending } = useEcosystemList();

  return isPending ? (
    <Skeleton className="h-10 w-full md:w-[160px]" />
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative flex w-full justify-start truncate pr-8 pl-3 md:w-48"
        >
          <div className="truncate">{props.ecosystem?.name}</div>
          <ChevronsUpDown className="absolute right-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full md:w-48">
        <DropdownMenuGroup>
          {ecosystems?.map((ecosystem) => (
            <DropdownMenuItem key={ecosystem.id} asChild>
              <Link
                href={`${props.ecosystemLayoutPath}/${ecosystem.slug}`}
                className="relative flex cursor-pointer items-center pr-3 pl-8"
              >
                {ecosystem.slug === props.ecosystem.slug && (
                  <CheckIcon className="absolute left-2 h-4 w-4 text-foreground" />
                )}
                <div className="truncate">{ecosystem.name}</div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href={`${props.ecosystemLayoutPath}/create`} className="">
          <DropdownMenuItem className="relative flex cursor-pointer items-center pr-3 pl-8">
            <PlusCircleIcon className="absolute left-2 h-4 w-4" />
            <div className="truncate">New Ecosystem</div>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function EcosystemHeader(props: {
  ecosystem: Ecosystem;
  ecosystemLayoutPath: string;
  allTimeStats: EcosystemWalletStats[];
  monthlyStats: EcosystemWalletStats[];
}) {
  const { data: fetchedEcosystem } = useEcosystem({
    slug: props.ecosystem.slug,
    refetchInterval:
      props.ecosystem.status === "requested"
        ? 3000
        : props.ecosystem.status === "paymentFailed"
          ? 60000
          : undefined,
    refetchOnWindowFocus: false,
    initialData: props.ecosystem,
  });
  const client = useThirdwebClient();

  const ecosystem = fetchedEcosystem ?? props.ecosystem;

  const ecosystemImageLink = resolveSchemeWithErrorHandler({
    uri: ecosystem.imageUrl,
    client,
  });

  return (
    <div className="flex flex-col gap-8">
      <EcosystemAlertBanner ecosystem={ecosystem} />
      <header className="flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-4 md:grid-cols-4 md:flex-row">
          <div className="flex items-center gap-4">
            {!ecosystem.imageUrl ? (
              <Skeleton className="size-24" />
            ) : (
              ecosystemImageLink && (
                <div className="relative size-24 overflow-hidden rounded-md">
                  <Image
                    src={ecosystemImageLink}
                    sizes="100px"
                    alt={ecosystem.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                </div>
              )
            )}
            <div className="flex flex-col gap-2">
              {!ecosystem.name ? (
                <Skeleton className="h-12 w-[225px]" />
              ) : (
                <h2 className="font-bold text-4xl text-foreground">
                  {ecosystem.name}
                </h2>
              )}
              {!ecosystem.slug ? (
                <Skeleton className="h-6 w-[300px]" />
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground">
                      ecosystem.{ecosystem.slug}
                    </p>
                    <CopyButton text={`ecosystem.${ecosystem.slug}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={`https://${ecosystem.slug}.ecosystem.thirdweb.com`}
                      className="text-link-foreground"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`${ecosystem.slug}.ecosystem.thirdweb.com`}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 md:items-end">
            <EcosystemSelect
              ecosystem={ecosystem}
              ecosystemLayoutPath={props.ecosystemLayoutPath}
            />
          </div>
        </div>
        <EcosystemWalletsSummary
          allTimeStats={props.allTimeStats}
          monthlyStats={props.monthlyStats}
        />
        <TabPathLinks
          links={[
            {
              name: "Overview",
              path: `${props.ecosystemLayoutPath}/${ecosystem.slug}`,
              exactMatch: true,
            },
            {
              name: "Analytics",
              path: `${props.ecosystemLayoutPath}/${ecosystem.slug}/analytics`,
              exactMatch: true,
            },
            {
              name: "Configuration",
              path: `${props.ecosystemLayoutPath}/${ecosystem.slug}/configuration`,
              exactMatch: true,
            },
            {
              name: "Design (Coming Soon)",
              path: `${props.ecosystemLayoutPath}/${ecosystem.slug}#`,
              isDisabled: true,
            },
          ]}
        />
      </header>
    </div>
  );
}
