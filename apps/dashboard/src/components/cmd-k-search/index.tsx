"use client";

import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChainIcon } from "components/icons/ChainIcon";
import { useTrack } from "hooks/analytics/useTrack";
import { type TrendingContract, fetchTopContracts } from "lib/search";
import { ArrowRightIcon, CommandIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { shortenIfAddress } from "utils/usedapp-external";

const TRACKING_CATEGORY = "any_contract_search";

const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_CONTRACT_API_KEY || "";

function contractTypesenseSearchQuery(
  searchQuery: string,
  queryClient: QueryClient,
  trackEvent: ReturnType<typeof useTrack>,
) {
  return {
    queryKey: ["typesense-contract-search", { search: searchQuery }],
    queryFn: async () => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "attempt",
        searchQuery,
      });

      return fetchTopContracts({
        query: searchQuery,
        perPage: 10,
        timeRange: "month",
      });
    },
    enabled: !!searchQuery && !!queryClient && !!typesenseApiKey,
    onSuccess: (d: unknown) => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "success",
        searchQuery,
        response: d,
      });
    },
    onError: (err: unknown) => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "failure",
        searchQuery,
        error: err,
      });
    },
    keepPreviousData: true,
  };
}

export const CmdKSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const trackEvent = useTrack();
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
  }, []);

  const [searchValue, setSearchValue] = useState("");

  // debounce 500ms
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const typesenseSearchQuery = useQuery<TrendingContract[]>(
    contractTypesenseSearchQuery(debouncedSearchValue, queryClient, trackEvent),
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

  const router = useRouter();

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchValue("");
    setActiveIndex(0);
  }, []);

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
          trackEvent({
            category: TRACKING_CATEGORY,
            action: "select_contract",
            input_mode: "keyboard",
            chainId: result.chainMetadata.chainId,
            contract_address: result.contractAddress,
          });
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
  }, [activeIndex, data, handleClose, open, router, trackEvent]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <div className="hidden lg:block w-[300px] relative">
        <Input
          onClick={() => setOpen(true)}
          placeholder="Search any contract"
          className="bg-transparent pr-4"
        />
        <div className="flex items-center text-sm text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 gap-[2px]">
          <CommandIcon className="size-3" /> K
        </div>
      </div>

      <Button
        className="lg:hidden p-2"
        aria-label="Search any contract"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
      </Button>

      {/* modal below here */}

      <DialogContent
        className="p-0 gap-0 z-[10000001]"
        dialogOverlayClassName="z-[10000000]"
      >
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
              <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Name or Contract Address"
                className="px-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isFetching ? (
                  <Spinner className="size-5 text-muted-foreground" />
                ) : searchValue.length > 0 ? (
                  <Button
                    size="sm"
                    aria-label="Clear search"
                    variant="ghost"
                    className="p-2 translate-x-2"
                    onClick={() => setSearchValue("")}
                  >
                    <XIcon className="size-4 text-muted-foreground" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {searchValue.length > 0 && (!isFetching || data.length) ? (
            <div className="border-t border-border">
              <ScrollShadow scrollableClassName="max-h-[50vh] md:max-h-[500px] p-2 rounded-lg">
                {!data || data?.length === 0 ? (
                  <div className="h-[100px] flex justify-center items-center p-4 text-secondary-foreground">
                    No contracts found
                  </div>
                ) : (
                  <div className="w-full">
                    {data.map((result, idx) => {
                      return (
                        <SearchResult
                          key={`${result.chainMetadata.chainId}_${result.contractAddress}`}
                          result={result}
                          isActive={idx === activeIndex}
                          onClick={() => {
                            handleClose();
                            trackEvent({
                              category: TRACKING_CATEGORY,
                              action: "select_contract",
                              input_mode: "click",
                              chainId: result.chainMetadata.chainId,
                              contract_address: result.contractAddress,
                            });
                          }}
                          onMouseEnter={() => setActiveIndex(idx)}
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

interface SearchResultProps {
  result: TrendingContract;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

const SearchResult: React.FC<SearchResultProps> = ({
  result,
  isActive,
  onMouseEnter,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative flex gap-4 items-center rounded-lg p-3 hover:bg-muted",
        isActive && "bg-muted",
      )}
    >
      <ChainIcon
        size={24}
        ipfsSrc={result.chainMetadata?.icon?.url}
        className="shrink-0"
      />
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-foreground font-semibold">
          <Link
            href={`/${result.chainMetadata.chainId}/${result.contractAddress}`}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
            className="before:absolute before:inset-0"
          >
            {shortenIfAddress(result.name)}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">
          {result.chainMetadata.name} -{" "}
          <span className="font-mono">
            {shortenIfAddress(result.contractAddress)}
          </span>
        </p>
      </div>
      <div className="flex ml-auto shrink-0">
        <ArrowRightIcon className="size-4 text-muted-foreground/50" />
      </div>
    </div>
  );
};
