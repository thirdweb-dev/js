"use client";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { AuthOption } from "../../../../wallets/types.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { socialIcons } from "../../../core/utils/walletIcon.js";
import { defaultAuthOptions } from "../../wallets/shared/ConnectWalletSocialOptions.js";
import { Img } from "../components/Img.js";
import { EmailIcon } from "./icons/EmailIcon.js";
import { FingerPrintIcon } from "./icons/FingerPrintIcon.js";
import { GuestIcon } from "./icons/GuestIcon.js";
import { PhoneIcon } from "./icons/PhoneIcon.js";

export function InAppWalletIcon(props: {
  client: ThirdwebClient;
  wallet: Wallet<"inApp">;
}) {
  const enabledAuthMethods = (
    props.wallet.getConfig()?.auth?.options || defaultAuthOptions
  )
    .slice() // clone
    .sort((a, b) => {
      if (a in socialIcons && !(b in socialIcons)) {
        return -1;
      }
      if (!(a in socialIcons) && b in socialIcons) {
        return 1;
      }
      return 0;
    });

  const theme = useCustomTheme();

  const firstMethod = enabledAuthMethods[0];
  const secondMethod = enabledAuthMethods[1];
  const thirdMethod = enabledAuthMethods[2];
  const fourthMethod = enabledAuthMethods[3];

  const offset = "4px";
  const offset2 = "6px";
  const smallIconSize = "20";
  const extraIconSize = "12";

  if (firstMethod && secondMethod) {
    return (
      <div
        style={{
          width: `${iconSize.xl}px`,
          height: `${iconSize.xl}px`,
          position: "relative",
          gap: spacing["3xs"],
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.md,
          backgroundColor: theme.colors.tertiaryBg,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: offset,
            left: offset,
            display: "flex",
          }}
        >
          <AuthOptionIcon
            authOption={firstMethod}
            client={props.client}
            size={smallIconSize}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: offset,
            right: offset,
            display: "flex",
          }}
        >
          <AuthOptionIcon
            authOption={secondMethod}
            client={props.client}
            size={smallIconSize}
          />
        </div>

        <div>
          {thirdMethod && (
            <div
              style={{
                position: "absolute",
                top: offset2,
                right: offset2,
                display: "flex",
              }}
            >
              <AuthOptionIcon
                authOption={thirdMethod}
                client={props.client}
                size={extraIconSize}
              />
            </div>
          )}

          {fourthMethod && (
            <div
              style={{
                position: "absolute",
                bottom: offset2,
                left: offset2,
                display: "flex",
              }}
            >
              <AuthOptionIcon
                authOption={fourthMethod}
                client={props.client}
                size={extraIconSize}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (firstMethod) {
    return (
      <div
        style={{
          width: `${iconSize.xl}px`,
          height: `${iconSize.xl}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.md,
          backgroundColor: theme.colors.tertiaryBg,
        }}
      >
        <AuthOptionIcon
          authOption={firstMethod}
          client={props.client}
          key={firstMethod}
          size={iconSize.lg}
        />
      </div>
    );
  }

  return null;
}

function AuthOptionIcon(props: {
  authOption: AuthOption;
  client: ThirdwebClient;
  size: string;
}) {
  const theme = useCustomTheme();
  if (props.authOption in socialIcons) {
    const icon = socialIcons[props.authOption as keyof typeof socialIcons];
    return (
      <Img
        src={icon}
        width={props.size}
        height={props.size}
        client={props.client}
      />
    );
  }

  if (props.authOption === "phone") {
    return <PhoneIcon size={props.size} color={theme.colors.secondaryText} />;
  }

  if (props.authOption === "email") {
    return <EmailIcon size={props.size} color={theme.colors.secondaryText} />;
  }

  if (props.authOption === "passkey") {
    return (
      <FingerPrintIcon size={props.size} color={theme.colors.secondaryText} />
    );
  }

  if (props.authOption === "guest") {
    return <GuestIcon size={props.size} color={theme.colors.secondaryText} />;
  }

  return null;
}
