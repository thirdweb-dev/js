"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

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

  // hah, no need for useEffect here this just works!
  if (inputRef.current?.value && !searchParams?.get("query")) {
    inputRef.current.value = "";
  }

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
      <SearchIcon className="absolute size-5 top-[50%] -translate-y-1/2 left-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or chain ID"
        className={"pl-12 h-10 py-2 text-base bg-secondary rounded-lg"}
        defaultValue={searchParams?.get("query") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        ref={inputRef}
      />
      {searchParams?.has("query") && (
        <Button
          size="icon"
          className="absolute top-[50%] -translate-y-1/2 right-2 text-muted-foreground"
          variant="ghost"
          onClick={() => {
            const params = new URLSearchParams(searchParams ?? undefined);
            params.delete("query");
            params.delete("page");
            const url = cleanUrl(`${pathname}?${params.toString()}`);
            router.replace(url);
          }}
        >
          <XCircleIcon className="size-5" />
        </Button>
      )}
    </div>
  );
};
