"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { useEcosystemList } from "../../../hooks/use-ecosystem-list";

export function EcosystemHeader({ ecosystemId }: { ecosystemId: string }) {
  const { ecosystems, isFetched } = useEcosystemList();
  const router = useRouter();
  const currentEcosystem = useMemo(
    () => ecosystems?.find((ecosystem) => ecosystem.id === ecosystemId),
    [ecosystems, ecosystemId],
  );

  if (
    isFetched &&
    !ecosystems?.find((ecosystem) => ecosystem.id === ecosystemId)
  ) {
    // No ecosystem found, redirect to ecosystems home page
    toast.error("Ecosystem not found");
    router.replace("/dashboard/connect/ecosystem");
  }

  if (!currentEcosystem) {
    return (
      <div className="container flex flex-col gap-8 px-4 py-6">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <header className="grid grid-cols-4">
      <div className="flex flex-col col-span-3 gap-2 mb-10 min-h-24">
        <h2 className="text-4xl font-bold text-foreground">
          {currentEcosystem.name}
        </h2>
        <p className="text-muted-foreground">{currentEcosystem.slug}</p>
      </div>
      <div className="flex flex-col items-end justify-between gap-4">
        <Link href="/dashboard/connect/ecosystem/create">
          <Button variant="primary">New Ecosystem</Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="relative flex justify-start w-40 pl-3 pr-8 truncate"
            >
              <div className="truncate">{currentEcosystem?.name}</div>
              <ChevronsUpDown className="absolute w-4 h-4 text-muted-foreground right-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {ecosystems?.map((ecosystem) => (
              <DropdownMenuItem key={ecosystem.id} asChild>
                <Link
                  href={`/dashboard/connect/ecosystem/${ecosystem.id}`}
                  className="relative flex items-center pl-8 pr-3 cursor-pointer"
                >
                  {ecosystem.id === ecosystemId && (
                    <CheckIcon className="absolute w-4 h-4 text-green-500 left-2" />
                  )}
                  <div className="truncate">{ecosystem.name}</div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
