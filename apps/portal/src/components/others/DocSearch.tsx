"use client";

import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

import type { SearchResult } from "@/app/api/search/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Command as CommandIcon,
  FileText as FileTextIcon,
  Search as SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { Spinner } from "../ui/Spinner/Spinner";
import { Input } from "../ui/input";
import { DynamicHeight } from "./DynamicHeight";

const suggestedLinks: { title: string; href: string }[] = [
  {
    title: "TypeScript SDK",
    href: "/typescript/v5",
  },
  {
    title: "Connect",
    href: "/connect",
  },
  {
    title: "Contracts",
    href: "/contracts",
  },
  {
    title: "Engine",
    href: "/engine",
  },
  {
    title: "Payments",
    href: "/payments",
  },
];

type Tag =
  | "React"
  | "React Native"
  | "Unity"
  | "TypeScript"
  | "Wallet SDK"
  | "Connect"
  | "Reference"
  | "Python"
  | "Contracts"
  | "Go"
  | "All"
  | "Infra"
  | "Solidity"
  | "Payments"
  | "Glossary"
  | "Engine";

function SearchModalContent(props: { closeModal: () => void }) {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);

  const [selectedTags, setSelectedTags] = useState<{
    [T in Tag]?: boolean;
  }>({});

  const [enabledTags, setEnabledTags] = useState<Tag[]>([]);
  const scrollableElement = useRef<HTMLDivElement | null>(null);

  const searchQuery = useQuery({
    queryKey: ["search-index", debouncedInput],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURI(debouncedInput)}`);
      const { results } = (await res.json()) as SearchResult;

      const tagsSet: Set<Tag> = new Set([]);

      if (results.length > 0) {
        tagsSet.add("All");
        setSelectedTags({
          All: true,
        });
      }

      for (const r of results) {
        const tags = getTagsFromHref(r.pageHref);
        if (tags) {
          for (const tag of tags) {
            tagsSet.add(tag);
          }
        }
      }

      const tags = Array.from(tagsSet);
      setEnabledTags(tags);

      scrollableElement.current?.scrollTo({
        top: 0,
      });

      return results;
    },
    enabled: debouncedInput.length > 0,
    placeholderData: keepPreviousData,
  });

  const data = searchQuery.data;
  const noResults =
    debouncedInput && searchQuery.isFetched && data && data.length === 0;

  const handleLinkClick = () => {
    props.closeModal();
  };

  return (
    <div>
      {/* Search  */}
      <div className="flex items-center gap-4 border-b px-4">
        {searchQuery.isFetching ? (
          <Spinner className="size-5" />
        ) : (
          <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
        )}

        <Input
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
              e.target.blur();
            }
          }}
          placeholder="Search documentation"
          className={cn(
            "h-auto flex-1 border-none bg-transparent p-4 px-0 text-base placeholder:text-base placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-transparent",
          )}
        />
      </div>

      <DynamicHeight>
        <div className="min-h-[200px]">
          {/* tags */}
          {enabledTags && enabledTags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-b p-4">
              {enabledTags.map((tag) => (
                <Button
                  variant="ghost"
                  key={tag}
                  className={cn(
                    "rounded-lg border px-3 py-1 text-sm ",
                    selectedTags[tag]
                      ? "!bg-muted !text-foreground border-foreground"
                      : "!bg-card !text-muted-foreground",
                  )}
                  onClick={() => {
                    // do not allow removing the last remaining tag
                    const enabledTags = Object.keys(selectedTags).filter(
                      (k) => selectedTags[k as Tag],
                    );
                    if (enabledTags.length === 1 && enabledTags[0] === tag) {
                      return;
                    }

                    setSelectedTags((prev) => {
                      const newValue = !prev[tag];

                      if (tag === "All") {
                        if (newValue) {
                          return {
                            [tag]: true,
                          };
                        }

                        return {
                          ...prev,
                          [tag]: false,
                        };
                      }

                      return {
                        ...prev,
                        [tag]: newValue,
                        All: newValue ? false : prev.All,
                      };
                    });
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}

          {/* links */}
          {data && data.length > 0 && (
            <div
              className="styled-scrollbar flex max-h-[50vh] min-h-[200px] flex-col gap-2 overflow-y-auto p-4"
              ref={scrollableElement}
            >
              {data.map((result) => {
                const tags = getTagsFromHref(result.pageHref);

                if (
                  !selectedTags.All &&
                  tags &&
                  !tags.find((t) => selectedTags[t] === true)
                )
                  return null;

                if (!tags && !selectedTags.All) {
                  return null;
                }

                const sections = result.sections
                  ?.filter((d) => d.content.length > 50)
                  .slice(0, 2);

                return (
                  <div key={result.pageHref} className="flex flex-col gap-2">
                    <SearchResultItem
                      type="page"
                      href={result.pageHref}
                      title={result.pageTitle}
                      tags={tags}
                      onClick={handleLinkClick}
                    />

                    {sections && sections.length > 0 && (
                      <div className="flex flex-col gap-2 border-l pl-3">
                        {sections.map((sectionData) => {
                          return (
                            <SearchResultItem
                              type="section"
                              href={result.pageHref + sectionData.href}
                              key={sectionData.href}
                              title={sectionData.title}
                              content={
                                sectionData.content.length < 100
                                  ? sectionData.content
                                  : `${sectionData.content.slice(0, 100)} ...`
                              }
                              onClick={handleLinkClick}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {noResults && (
            <div className="flex min-h-[200px] items-center justify-center">
              <p> No Results </p>
            </div>
          )}

          {!debouncedInput && (!data || data.length === 0) && (
            <NoSearchLinks onClick={handleLinkClick} />
          )}
        </div>
      </DynamicHeight>
    </div>
  );
}

function NoSearchLinks(props: { onClick?: () => void }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      {suggestedLinks.map((link) => {
        return (
          <SearchResultItem
            type="page"
            href={link.href}
            title={link.title}
            key={link.href}
            onClick={props.onClick}
          />
        );
      })}
    </div>
  );
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const queryClient = new QueryClient();

export function DocSearch(props: { variant: "icon" | "search" }) {
  const [open, setOpen] = useState(false);

  const forDesktop = props.variant === "search";
  useEffect(() => {
    if (!forDesktop) {
      return;
    }
    // when cmd+k on MacOS or ctrl+k on Windows is pressed, open the search modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [forDesktop]);

  // when escape is pressed, close the search modal
  useEffect(() => {
    if (!forDesktop) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [forDesktop]);

  return (
    <QueryClientProvider client={queryClient}>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Desktop */}

        {forDesktop && (
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex w-56 justify-between px-3"
            >
              Search Docs
              <div className="flex items-center gap-1 rounded-sm border bg-background px-2 py-1 text-muted-foreground text-xs">
                <CommandIcon className="size-3" />K
              </div>
            </Button>
          </DialogTrigger>
        )}

        {!forDesktop && (
          <DialogTrigger asChild>
            <Button variant="ghost" className="px-3">
              <SearchIcon className="size-6 text-foreground" />
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="bg-background sm:max-w-[550px]">
          <SearchModalContent
            closeModal={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </QueryClientProvider>
  );
}

// function isNewSDK(href: string) {
// 	return href.includes("/typescript/v5");
// }

function getTagsFromHref(href: string): Tag[] | undefined {
  if (href.includes("/react-native/v0")) {
    if (href.includes("/references")) {
      return ["Reference", "React Native"];
    }
    return ["React Native"];
  }
  if (href.includes("/react/v4")) {
    if (href.includes("/references")) {
      return ["Reference", "React"];
    }
    return ["React"];
  }
  if (href.includes("/typescript/v4")) {
    if (href.includes("/references")) {
      return ["Reference", "TypeScript"];
    }
    return ["TypeScript"];
  }
  if (href.includes("/wallet-sdk/v2")) {
    if (href.includes("/references")) {
      return ["Reference", "Wallet SDK"];
    }
    return ["Wallet SDK"];
  }
  if (href.includes("/unity")) {
    return ["Unity"];
  }
  if (href.includes("/typescript/v5")) {
    if (href.includes("/references")) {
      return ["Reference", "TypeScript"];
    }
    return ["TypeScript"];
  }
  if (href.includes("/react/v5")) {
    return ["React"];
  }
  if (href.includes("/connect")) {
    return ["Connect"];
  }
  if (href.includes("/engine")) {
    return ["Engine"];
  }
  if (href.includes("/infrastructure")) {
    return ["Infra"];
  }
  if (href.includes("/solidity")) {
    return ["Solidity"];
  }
  if (href.includes("/contracts")) {
    return ["Contracts"];
  }
  if (href.includes("/payments")) {
    return ["Payments"];
  }
  if (href.includes("/glossary")) {
    return ["Glossary"];
  }
}

function SearchResultItem(props: {
  href: string;
  title: string;
  content?: string;
  tags?: Tag[];
  type: "page" | "section";
  onClick?: () => void;
}) {
  return (
    <Link
      className="flex gap-3 rounded-sm bg-muted/50 px-4 py-3 text-muted-foreground transition-colors hover:bg-accent"
      href={props.href}
      onClick={props.onClick}
    >
      <div className="flex w-full flex-col gap-1">
        {props.title && (
          <div className="flex flex-wrap items-center justify-between gap-2 break-all text-base text-foreground">
            <div
              className={cn(
                "flex items-center gap-2",
                props.type === "page"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {props.type === "page" && (
                <FileTextIcon className="size-5 text-muted-foreground" />
              )}

              {props.title}
            </div>

            {props.tags && (
              <div className="flex gap-2">
                {props.tags.map((tag) => {
                  return (
                    <span
                      key={tag}
                      className={cn(
                        "shrink-0 rounded-lg border bg-muted px-1.5 py-1 text-muted-foreground text-xs",
                      )}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {props.content && <div className="text-sm">{props.content}</div>}
      </div>
    </Link>
  );
}

// const HighlightMatches = memo(function _HighlightMatches(props: {
// 	value: string;
// 	match: string;
// }) {
// 	const tokens = getMatches(props);
// 	return (
// 		<div>
// 			{tokens.map((t) => {
// 				return (
// 					<span
// 						key={t.text}
// 						className={t.highlight ? "bg-muted text-foreground" : "text-muted-foreground"}
// 					>
// 						{t.text}
// 					</span>
// 				);
// 			})}
// 		</div>
// 	);
// });
