"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SearchType } from "./types";

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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select
          value={searchType}
          onValueChange={(value) => setSearchType(value as SearchType)}
        >
          <SelectTrigger className="w-[140px] bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="address">Address</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Input
            className="bg-card pl-9"
            placeholder={`Search by ${searchType}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
        </div>

        <Button
          onClick={handleSearch}
          disabled={!query.trim() || props.isLoading}
          size="sm"
        >
          {props.isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {props.hasResults && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="gap-2"
          >
            Clear Search & Return to List
          </Button>
        </div>
      )}
    </div>
  );
}
