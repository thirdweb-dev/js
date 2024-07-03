"use client";
import { CopyButton } from "@/components/ui/CopyButton";
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
import { TabLinks } from "@/components/ui/tabs";
import { thirdwebClient } from "@/constants/client";
import { CheckIcon, ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveScheme } from "thirdweb/storage";
import { useEcosystemList } from "../../../../hooks/use-ecosystem-list";
import { useEcosystem } from "../../hooks/use-ecosystem";

export function EcosystemHeader({ ecosystemSlug }: { ecosystemSlug: string }) {
  const { ecosystem, isLoading } = useEcosystem({ slug: ecosystemSlug });
  const pathname = usePathname();
  const { ecosystems } = useEcosystemList();

  return (
    <header className="flex flex-col gap-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:grid-cols-4">
        <div className="flex items-center gap-4">
          {isLoading || !ecosystem ? (
            <Skeleton className="size-24" />
          ) : (
            ecosystem.imageUrl && (
              <div className="relative overflow-hidden rounded-md size-24">
                <Image
                  src={resolveScheme({
                    uri: ecosystem.imageUrl,
                    client: thirdwebClient,
                  })}
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
            {isLoading || !ecosystem ? (
              <Skeleton className="h-12 w-[225px]" />
            ) : (
              <h2 className="text-4xl font-bold text-foreground">
                {ecosystem.name}
              </h2>
            )}
            {isLoading || !ecosystem ? (
              <Skeleton className="h-6 w-[300px]" />
            ) : (
              <div className="flex items-center gap-1">
                <p className="text-muted-foreground">
                  ecosystem.{ecosystem.slug}
                </p>
                <CopyButton text={`ecosystem.${ecosystem.slug}`} />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:items-end">
          {isLoading || !ecosystem ? (
            <Skeleton className="h-10 w-full md:w-[160px]" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex justify-start w-full pl-3 pr-8 truncate md:w-48"
                >
                  <div className="truncate">{ecosystem?.name}</div>
                  <ChevronsUpDown className="absolute w-4 h-4 text-muted-foreground right-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full md:w-48">
                <DropdownMenuGroup>
                  {ecosystems?.map((ecosystem) => (
                    <DropdownMenuItem key={ecosystem.id} asChild>
                      <Link
                        href={`/dashboard/connect/ecosystem/${ecosystem.slug}`}
                        className="relative flex items-center pl-8 pr-3 cursor-pointer"
                      >
                        {ecosystem.slug === ecosystemSlug && (
                          <CheckIcon className="absolute w-4 h-4 text-foreground left-2" />
                        )}
                        <div className="truncate">{ecosystem.name}</div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link href="/dashboard/connect/ecosystem/create" className="">
                  <DropdownMenuItem className="relative flex items-center pl-8 pr-3 cursor-pointer">
                    <PlusCircleIcon className="absolute w-4 h-4 left-2" />
                    <div className="truncate">New Ecosystem</div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <TabLinks
        links={[
          {
            name: "Permissions",
            href: `/dashboard/connect/ecosystem/${ecosystemSlug}/permissions`,
            isActive: pathname?.endsWith("/permissions") || false, // pathname will almost never be null: https://nextjs.org/docs/app/api-reference/functions/use-pathname
            isEnabled: true,
          },
          {
            name: "Analytics (Coming Soon)",
            href: "#",
            isActive: false,
            isEnabled: false,
          },
          {
            name: "Design (Coming Soon)",
            href: "#",
            isActive: false,
            isEnabled: false,
          },
        ]}
      />
    </header>
  );
}
