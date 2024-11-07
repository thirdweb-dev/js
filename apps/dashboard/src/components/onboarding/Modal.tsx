import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { IconLogo } from "components/logo";
import type { ComponentWithChildren } from "types/component-with-children";

interface OnboardingModalProps {
  isOpen: boolean;
  wide?: boolean;
  // Pass this props to make the modal closable (it will enable backdrop + the "x" icon)
  onOpenChange?: (open: boolean) => void;
}

export const OnboardingModal: ComponentWithChildren<OnboardingModalProps> = ({
  children,
  isOpen,
  wide,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        dialogOverlayClassName="z-[10000]"
        className={cn("z-[10001] max-h-[90vh] overflow-auto", {
          "!max-w-[768px]": wide,
        })}
        dialogCloseClassName={onOpenChange !== undefined ? "" : "hidden"}
      >
        <div className="flex flex-col gap-4">
          <div className="w-[40px]">
            <IconLogo />
          </div>
          <div className="flex flex-col gap-8">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
