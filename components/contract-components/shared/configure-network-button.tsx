import { Icon, forwardRef } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useSetIsNetworkConfigModalOpen } from "hooks/networkConfigModal";
import { IoMdSettings } from "react-icons/io";
import { Button, ButtonProps } from "tw-components";

interface ConfigureNetworkButtonProps extends ButtonProps {
  label: string;
  children?: React.ReactNode;
}

export const ConfigureNetworkButton = forwardRef<
  ConfigureNetworkButtonProps,
  "button"
>(({ label, children = "Configure Networks", ...restButtonProps }, ref) => {
  const trackEvent = useTrack();
  const setIsNetworkModalOpen = useSetIsNetworkConfigModalOpen();

  const handleClick = () => {
    trackEvent({
      category: "configure-networks",
      action: "click",
      label,
    });
    setIsNetworkModalOpen(true);
  };

  return (
    <Button
      ref={ref}
      variant="filled"
      background="inputBg"
      _hover={{
        background: "inputBgHover",
      }}
      leftIcon={<Icon color="inherit" as={IoMdSettings} />}
      onClick={handleClick}
      py={3}
      {...restButtonProps}
    >
      {children}
    </Button>
  );
});
