import { IconButton, Icon, Tooltip } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import React from "react";
import { FaRectangleList } from "react-icons/fa6";
import { RiFileListFill } from "react-icons/ri";

export function ModalSizeButton(props: {
  modalSize: "compact" | "wide";
  isSelected: boolean;
  onClick: () => void;
  theme: "light" | "dark";
  trackingCategory: string;
}) {
  const trackEvent = useTrack();
  return (
    <Tooltip label={props.modalSize === "wide" ? "Wide" : "Compact"}>
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
          <Icon
            as={props.modalSize === "wide" ? FaRectangleList : RiFileListFill}
            width={5}
            height={5}
          />
        }
        onClick={() => {
          props.onClick();
          trackEvent({
            action: "click",
            category: props.trackingCategory,
            label: "cutomize",
            input: "modalSize",
            modalSize: props.modalSize,
          });
        }}
      />
    </Tooltip>
  );
}
