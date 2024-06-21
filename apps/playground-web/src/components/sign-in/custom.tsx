"use client";
import { ConnectButton } from "thirdweb/react";
import { darkTheme, lightTheme } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";

export const CustomizedConnect = () => {
  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      connectButton={{
        label: "Custom Connect Button",
      }}
      showAllWallets={false}
      connectModal={{
        title: "Custom Connect Modal",
        size: "compact",
      }}
      theme={darkTheme({
        colors: {
          modalBg: "#281866",
          accentButtonBg: "#281866",
          connectedButtonBgHover: "#281866",
          borderColor: "rgba(256, 256,256, 0.1)",
          accentText: "rgba(256, 256,256, 0.1)",
          connectedButtonBg: "#281866",
          tertiaryBg: "rgba(256, 256,256, 0.1)",
          primaryButtonBg: "#281866",
          secondaryButtonBg: "rgba(256, 256,256, 0.1)",
          primaryButtonText: "#E7E8E9",
          primaryText: "#E7E8E9",
          separatorLine: "rgba(256, 256,256, 0.1)",
        },
      })}
    />
  );
};
