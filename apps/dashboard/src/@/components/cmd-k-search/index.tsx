"use client";

import {
  keepPreviousData,
  type QueryClient,
  queryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ArrowRightIcon, CommandIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ChainIconClient } from "@/icons/ChainIcon";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { fetchTopContracts, type TrendingContract } from "@/lib/search";
import { cn } from "@/lib/utils";
import { shortenIfAddress } from "@/utils/usedapp-external";

const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_CONTRACT_API_KEY || "";

function contractTypesenseSearchQuery(
  searchQuery: string,
  queryClient: QueryClient,
) {
  return queryOptions({
    enabled: !!searchQuery && !!queryClient && !!typesenseApiKey,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return fetchTopContracts({
        perPage: 10,
        query: searchQuery,
        timeRange: "month",
      });
    },
    queryKey: ["typesense-contract-search", { search: searchQuery }],
  });
}

export const CmdKSearchModal = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  client: ThirdwebClient;
}) => {
  const { open, setOpen } = props;
  const queryClient = useQueryClient();

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open_) => !open_);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const [searchValue, setSearchValue] = useState("");

  // debounce 500ms
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const typesenseSearchQuery = useQuery(
    contractTypesenseSearchQuery(debouncedSearchValue, queryClient),
  );

  const data = useMemo(() => {
    const potentiallyDuplicated = [...(typesenseSearchQuery.data || [])].filter(
      (d) => !!d,
    ) as TrendingContract[];

    // dedupe the results
    return Array.from(
      new Set(
        potentiallyDuplicated.map(
          (d) => `${d.chainMetadata.chainId}_${d.contractAddress}`,
        ),
      ),
    ).map((chainIdAndAddress) => {
      return potentiallyDuplicated.find((d) => {
        return (
          `${d.chainMetadata.chainId}_${d.contractAddress}` ===
          chainIdAndAddress
        );
      });
    }) as TrendingContract[];
  }, [typesenseSearchQuery]);

  const isFetching = useMemo(() => {
    return (
      typesenseSearchQuery.isFetching || debouncedSearchValue !== searchValue
    );
  }, [debouncedSearchValue, searchValue, typesenseSearchQuery.isFetching]);
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useDashboardRouter();

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchValue("");
    setActiveIndex(0);
  }, [setOpen]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // re-set the active index if we are fetching
    if (isFetching && !data.length) {
      setActiveIndex(0);
    }
  }, [data.length, isFetching]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // only if the modal is open
    if (!open) {
      return;
    }
    const down = (e: KeyboardEvent) => {
      // if something is selected and we press enter or space we should go to the contract
      if (e.key === "Enter" && data) {
        const result = data[activeIndex];
        if (result) {
          e.preventDefault();
          router.push(
            `/${result.chainMetadata.chainId}/${result.contractAddress}`,
          );

          handleClose();
        }
      } else if (e.key === "ArrowDown") {
        // if we press down we should move the selection down
        e.preventDefault();
        setActiveIndex((aIndex) => {
          if (data) {
            return Math.min(aIndex + 1, data.length - 1);
          }
          return aIndex;
        });
      } else if (e.key === "ArrowUp") {
        // if we press up we should move the selection up
        e.preventDefault();
        setActiveIndex((aIndex) => Math.max(aIndex - 1, 0));
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [activeIndex, data, handleClose, open, router]);

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
      open={open}
    >
      <DialogContent className="gap-0 p-0">
        {/* Title */}
        <DynamicHeight>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="mb-1">Search Contracts</DialogTitle>
              <DialogDescription>
                Search a contract by name or contract address across all
                blockchains
              </DialogDescription>
            </DialogHeader>

            {/* Search */}
            <div className="relative mt-4 ">
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                autoFocus
                className="px-10"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Name or Contract Address"
                value={searchValue}
              />
              <div className="-translate-y-1/2 absolute top-1/2 right-3">
                {isFetching ? (
                  <Spinner className="size-5 text-muted-foreground" />
                ) : searchValue.length > 0 ? (
                  <Button
                    aria-label="Clear search"
                    className="translate-x-2 p-2"
                    onClick={() => setSearchValue("")}
                    size="sm"
                    variant="ghost"
                  >
                    <XIcon className="size-4 text-muted-foreground" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {searchValue.length > 0 && (!isFetching || data.length) ? (
            <div className="border-border border-t">
              <ScrollShadow scrollableClassName="max-h-[50vh] md:max-h-[500px] p-2 rounded-lg">
                {!data || data?.length === 0 ? (
                  <div className="flex h-[100px] items-center justify-center p-4 text-muted-foreground">
                    No contracts found
                  </div>
                ) : (
                  <div className="w-full">
                    {data.map((result, idx) => {
                      return (
                        <SearchResult
                          client={props.client}
                          isActive={idx === activeIndex}
                          key={`${result.chainMetadata.chainId}_${result.contractAddress}`}
                          onClick={() => {
                            handleClose();
                          }}
                          onMouseEnter={() => setActiveIndex(idx)}
                          result={result}
                        />
                      );
                    })}
                  </div>
                )}
              </ScrollShadow>
            </div>
          ) : null}
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
};

export const CmdKSearch = (props: {
  className?: string;
  client: ThirdwebClient;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative hidden w-[300px] lg:block">
        <Input
          className={cn("bg-transparent pr-4", props.className)}
          onClick={() => setOpen(true)}
          placeholder="Search any contract"
        />
        <div className="-translate-y-1/2 absolute top-1/2 right-3 flex items-center gap-[2px] text-muted-foreground text-sm">
          <CommandIcon className="size-3" /> K
        </div>
      </div>

      <Button
        aria-label="Search any contract"
        className="!h-auto !w-auto p-2 lg:hidden"
        onClick={() => setOpen(true)}
        variant="ghost"
      >
        <SearchIcon className="size-5" />
      </Button>

      <CmdKSearchModal client={props.client} open={open} setOpen={setOpen} />
    </>
  );
};

interface SearchResultProps {
  result: TrendingContract;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  client: ThirdwebClient;
}

const SearchResult: React.FC<SearchResultProps> = ({
  result,
  isActive,
  onMouseEnter,
  onClick,
  client,
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center gap-4 rounded-lg p-3 hover:bg-accent",
        isActive && "bg-muted",
      )}
    >
      <ChainIconClient
        className="size-6 shrink-0"
        client={client}
        src={result.chainMetadata?.icon?.url}
      />
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 font-semibold text-foreground">
          <Link
            className="before:absolute before:inset-0"
            href={`/${result.chainMetadata.chainId}/${result.contractAddress}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
          >
            {shortenIfAddress(result.name)}
          </Link>
        </h3>
        <p className="text-muted-foreground text-xs">
          {result.chainMetadata.name} -{" "}
          <span className="font-mono">
            {shortenIfAddress(result.contractAddress)}
          </span>
        </p>
      </div>
      <div className="ml-auto flex shrink-0">
        <ArrowRightIcon className="size-4 text-muted-foreground/50" />
      </div>
    </div>
  );
};
