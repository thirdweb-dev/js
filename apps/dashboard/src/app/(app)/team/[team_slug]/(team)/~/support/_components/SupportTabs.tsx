import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SupportTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "all", label: "All Cases" },
  { id: "open", label: "Open Cases" },
  { id: "resolved", label: "Resolved Cases" },
];

export function SupportTabs({ activeTab, onTabChange }: SupportTabsProps) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-[#262626] bg-[#121212]">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 px-4 py-2 font-medium text-[#737373] text-sm transition-colors hover:bg-[#1e1e1e]",
            activeTab === tab.id && "bg-[#1e1e1e] text-white",
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
