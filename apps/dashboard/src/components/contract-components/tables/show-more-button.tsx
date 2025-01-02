import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import type { SetStateAction } from "react";

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
        onClick={() => setShowMoreLimit(showMoreLimit + limit)}
        variant="ghost"
        size="sm"
        className="gap-2"
      >
        Show more
        <ChevronDownIcon className="size-4" />
      </Button>
    </div>
  );
};
