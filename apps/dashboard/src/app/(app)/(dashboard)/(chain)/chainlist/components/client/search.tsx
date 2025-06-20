"use client";

import { SearchIcon, XCircleIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";

function cleanUrl(url: string) {
  if (url.endsWith("?")) {
    return url.slice(0, -1);
  }
  return url;
}

export const SearchInput: React.FC = () => {
  const router = useDashboardRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // reset the input if the query param is removed
    if (inputRef.current?.value && !searchParams?.get("query")) {
      inputRef.current.value = "";
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams ?? undefined);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // always delete the page number when searching
    params.delete("page");
    const url = cleanUrl(`${pathname}?${params.toString()}`);
    router.replace(url);
  }, 300);

  return (
    <div className="relative w-full">
      <SearchIcon className="-translate-y-1/2 absolute top-[50%] left-3 size-4 text-muted-foreground" />
      <Input
        className="h-10 rounded-lg bg-card py-2 pl-9 lg:min-w-[300px]"
        defaultValue={searchParams?.get("query") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by name or chain ID"
        ref={inputRef}
      />
      {searchParams?.has("query") && (
        <Button
          className="-translate-y-1/2 absolute top-[50%] right-2 text-muted-foreground"
          onClick={() => {
            const params = new URLSearchParams(searchParams ?? undefined);
            params.delete("query");
            params.delete("page");
            const url = cleanUrl(`${pathname}?${params.toString()}`);
            router.replace(url);
          }}
          size="icon"
          variant="ghost"
        >
          <XCircleIcon className="size-5" />
        </Button>
      )}
    </div>
  );
};
