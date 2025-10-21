"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchType } from "./types";

const searchTypeLabels: Record<SearchType, string> = {
  email: "Email",
  phone: "Phone",
  id: "Auth Identifier",
  address: "Address",
  externalWallet: "External Wallet",
  userId: "User Identifier",
};

export function AdvancedSearchInput(props: {
  onSearch: (searchType: SearchType, query: string) => void;
  onClear: () => void;
  isLoading: boolean;
  hasResults: boolean;
}) {
  const [searchType, setSearchType] = useState<SearchType>("email");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      props.onSearch(searchType, query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    props.onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Select
        value={searchType}
        onValueChange={(value) => setSearchType(value as SearchType)}
      >
        <SelectTrigger className="w-[140px] bg-background rounded-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="id">Auth Identifier</SelectItem>
          <SelectItem value="userId">User Identifier</SelectItem>
          <SelectItem value="address">Address</SelectItem>
          <SelectItem value="externalWallet">External Wallet</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-1">
        <div className="relative flex-1">
          <Input
            className="bg-background pl-9 border-r-0 rounded-r-none rounded-l-full"
            placeholder={`Search by ${searchTypeLabels[searchType]}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />

          {props.hasResults && (
            <div className="absolute top-1/2 -translate-y-1/2 right-2 ">
              <Button
                variant="ghost"
                onClick={handleClear}
                className="p-1 h-auto"
              >
                <XIcon className="size-4 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={handleSearch}
          variant="outline"
          disabled={!query.trim() || props.isLoading}
          className="rounded-l-none rounded-r-full gap-2 bg-background disabled:opacity-100"
        >
          {props.isLoading && <Spinner className="size-4" />}
          Search
        </Button>
      </div>
    </div>
  );
}
