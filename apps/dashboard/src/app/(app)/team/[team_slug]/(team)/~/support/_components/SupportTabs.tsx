import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SupportTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    open: number;
    closed: number;
  };
}

export function SupportTabs({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  counts,
}: SupportTabsProps) {
  const tabs = [
    { count: counts.all, id: "all", label: "All" },
    { count: counts.open, id: "open", label: "Open" },
    { count: counts.closed, id: "closed", label: "Closed" },
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] w-4 h-4" />
        <Input
          className="pl-10 w-80 bg-[#0A0A0A] border-[#1F1F1F] text-white placeholder:text-[#737373] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2663EB]"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cases..."
          value={searchQuery}
        />
      </div>

      {/* Tab Buttons */}
      <div className="grid w-fit grid-cols-3 bg-[#0A0A0A] border border-[#1F1F1F] p-1 rounded-lg">
        {tabs.map((tab) => (
          <Button
            className={cn(
              "h-8 px-3 py-1 font-medium text-sm transition-colors rounded-md",
              activeTab === tab.id
                ? "bg-[#1F1F1F] text-white"
                : "text-[#737373] hover:text-white",
            )}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant="ghost"
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>
    </div>
  );
}
