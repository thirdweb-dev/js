import { ChevronDownIcon } from "lucide-react";
import type { SetStateAction } from "react";
import { Button } from "@/components/ui/button";

interface ShowMoreButtonProps {
  limit: number;
  showMoreLimit: number;
  setShowMoreLimit: (value: SetStateAction<number>) => void;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  limit,
  showMoreLimit,
  setShowMoreLimit,
}) => {
  return (
    <div className="flex justify-center border-border border-t py-4">
      <Button
        className="gap-2"
        onClick={() => setShowMoreLimit(showMoreLimit + limit)}
        size="sm"
        variant="ghost"
      >
        Show more
        <ChevronDownIcon className="size-4" />
      </Button>
    </div>
  );
};
