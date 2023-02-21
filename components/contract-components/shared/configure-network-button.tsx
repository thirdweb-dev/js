import { Icon, forwardRef } from "@chakra-ui/react";
import { ConfigureNetworkModal } from "components/configure-networks/ConfigureNetworkModal";
import { useTrack } from "hooks/analytics/useTrack";
import { useState } from "react";
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
  const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);

  return (
    <>
      <Button
        ref={ref}
        variant="filled"
        background="inputBg"
        _hover={{
          background: "inputBgHover",
        }}
        leftIcon={<Icon color="inherit" as={IoMdSettings} />}
        onClick={() => {
          trackEvent({
            category: "configure-networks",
            action: "click",
            label,
          });
          setShowAddNetworkModal(true);
        }}
        py={3}
        {...restButtonProps}
      >
        {children}
      </Button>

      {showAddNetworkModal && (
        <ConfigureNetworkModal onClose={() => setShowAddNetworkModal(false)} />
      )}
    </>
  );
});
