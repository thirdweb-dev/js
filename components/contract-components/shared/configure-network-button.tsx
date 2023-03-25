import { Icon, IconButton, Tooltip, forwardRef } from "@chakra-ui/react";
import { ConfigureNetworkModal } from "components/configure-networks/ConfigureNetworkModal";
import { useTrack } from "hooks/analytics/useTrack";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Button, ButtonProps } from "tw-components";

interface ConfigureNetworkButtonProps extends ButtonProps {
  label: string;
  children?: React.ReactNode;
  iconOnly?: boolean;
}

export const ConfigureNetworkButton = forwardRef<
  ConfigureNetworkButtonProps,
  "button"
>(
  (
    { label, children = "Configure Networks", iconOnly, ...restButtonProps },
    ref,
  ) => {
    const trackEvent = useTrack();
    const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);
    const handleClick = () => {
      trackEvent({
        category: "configure-networks",
        action: "click",
        label,
      });
      setShowAddNetworkModal(true);
    };

    return (
      <>
        {iconOnly ? (
          <Tooltip
            label="Configure Networks"
            hasArrow
            offset={[0, 20]}
            bg="backgroundCardHighlight"
            color="heading"
          >
            <IconButton
              aria-label="Configure Networks"
              icon={<Icon color="inherit" as={IoMdSettings} />}
              bg="none"
              size="sm"
              onClick={handleClick}
            />
          </Tooltip>
        ) : (
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
        )}

        {showAddNetworkModal && (
          <ConfigureNetworkModal
            onClose={() => setShowAddNetworkModal(false)}
          />
        )}
      </>
    );
  },
);
