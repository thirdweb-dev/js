import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SupportCaseFilters(props: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    open: number;
    closed: number;
  };
}) {
  const { activeTab, onTabChange, searchQuery, onSearchChange, counts } = props;
  const tabs = [
    { count: counts.all, id: "all", label: "All" },
    { count: counts.open, id: "open", label: "Open" },
    { count: counts.closed, id: "closed", label: "Closed" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search Bar */}
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          className="pl-9 bg-card rounded-lg"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          value={searchQuery}
        />
      </div>

      {/* Tab Buttons */}
      <div className="grid w-full grid-cols-3 border bg-card p-1 rounded-lg sm:w-fit gap-0.5">
        {tabs.map((tab) => (
          <Button
            className={cn(
              "h-8 px-2 py-1 text-sm transition-colors rounded-sm sm:px-3",
              activeTab === tab.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/70",
            )}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant="ghost"
          >
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
