import { ToolTipLabel } from "@/components/ui/tooltip";
import { IconButton } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { ListIcon, Rows3Icon } from "lucide-react";

export function ModalSizeButton(props: {
  modalSize: "compact" | "wide";
  isSelected: boolean;
  onClick: () => void;
  theme: "light" | "dark";
  trackingCategory: string;
}) {
  const trackEvent = useTrack();
  return (
    <ToolTipLabel label={props.modalSize === "wide" ? "Wide" : "Compact"}>
      <IconButton
        w={10}
        h={10}
        border="2px solid"
        bg="none"
        _hover={{
          bg: "none",
        }}
        borderRadius="50%"
        aria-label="compact"
        color={props.isSelected ? "blue.500" : "heading"}
        borderColor={props.isSelected ? "blue.500" : "gray.800"}
        icon={
          props.modalSize === "wide" ? (
            <ListIcon className="size-5" />
          ) : (
            <Rows3Icon className="size-5" />
          )
        }
        onClick={() => {
          props.onClick();
          trackEvent({
            action: "click",
            category: props.trackingCategory,
            label: "customize",
            input: "modalSize",
            modalSize: props.modalSize,
          });
        }}
      />
    </ToolTipLabel>
  );
}
