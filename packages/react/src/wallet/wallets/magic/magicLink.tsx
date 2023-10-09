import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  SelectUIProps,
  WalletConfig,
  WalletOptions,
  useConnect,
} from "@thirdweb-dev/react-core";
import type { ConfiguredMagicLinkWallet } from "./types";
import { useRef, useEffect, useCallback } from "react";
import { Spinner } from "../../../components/Spinner";
import { Container, ModalHeader } from "../../../components/basic";
import { InputSelectionUI } from "../InputSelectionUI";
import { Img } from "../../../components/Img";
import { Theme, fontSize, iconSize, spacing } from "../../../design-system";
import { Button, IconButton } from "../../../components/buttons";
import { ToolTip } from "../../../components/Tooltip";
import styled from "@emotion/styled";
import { WalletEntryButton } from "../../ConnectWallet/WalletSelector";
import {
  emailAndPhoneIcon,
  emailIcon,
  phoneIcon,
} from "../../ConnectWallet/icons/dataUris";
import { TextDivider } from "../../../components/TextDivider";
import { useScreenContext } from "../../ConnectWallet/Modal/screen";
import { reservedScreens } from "../../ConnectWallet/constants";
import { Spacer } from "../../../components/Spacer";

export function magicLink(
  config: MagicLinkAdditionalOptions & {
    /**
     * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
     */
    recommended?: boolean;
  },
): ConfiguredMagicLinkWallet {
  const emailLoginEnabled = config.emailLogin !== false;
  const smsLoginEnabled = config.smsLogin !== false;
  const oauthProviders = config.oauthOptions?.providers;

  const type = config.type || "auth";

  let icon = emailAndPhoneIcon;
  let iconText = "Email or phone";

  if (emailLoginEnabled && !smsLoginEnabled) {
    icon = emailIcon;
    iconText = "Email";
  }

  if (!emailLoginEnabled && smsLoginEnabled) {
    icon = phoneIcon;
    iconText = "Phone number";
  }

  if (!emailLoginEnabled && !smsLoginEnabled) {
    iconText = "Social login";
  }

  return {
    category: "socialLogin",
    id: MagicLink.id,
    recommended: config?.recommended,
    isHeadless: true,
    meta: {
      ...MagicLink.meta,
      name: iconText,
      iconURL: icon,
    },
    create: (options: WalletOptions) =>
      new MagicLink({ ...options, ...config }),
    connectUI(props) {
      if (props.modalSize === "wide") {
        return (
          <MagicConnectionUIScreen
            {...props}
            type={type}
            emailLogin={emailLoginEnabled}
            smsLogin={smsLoginEnabled}
            oauthProviders={oauthProviders}
          />
        );
      }

      if (props.selectionData === undefined) {
        return (
          <MagicConnectionUIScreen
            {...props}
            type={type}
            emailLogin={emailLoginEnabled}
            smsLogin={smsLoginEnabled}
            oauthProviders={oauthProviders}
          />
        );
      }

      return <MagicConnectingUI {...props} type={type} />;
    },
    // select UI only for auth
    selectUI:
      config.type === "connect"
        ? undefined
        : (props) => {
            return (
              <MagicSelectUI
                {...props}
                emailLoginEnabled={emailLoginEnabled}
                smsLoginEnabled={smsLoginEnabled}
                oauthProviders={oauthProviders}
              />
            );
          },
    isInstalled() {
      return false;
    },
  };
}

const MagicSelectUI = (
  props: SelectUIProps<MagicLink> & {
    emailLoginEnabled: boolean;
    smsLoginEnabled: boolean;
    oauthProviders?: OuthProvider[];
  },
) => {
  const screen = useScreenContext();

  if (
    props.modalSize === "wide" ||
    (screen !== reservedScreens.main && props.modalSize === "compact")
  ) {
    return (
      <WalletEntryButton
        walletConfig={props.walletConfig}
        selectWallet={() => props.onSelect(undefined)}
      />
    );
  }

  return (
    <MagicUI
      {...props}
      emailLogin={props.emailLoginEnabled}
      smsLogin={props.smsLoginEnabled}
      oauthProviders={props.oauthProviders}
    />
  );
};

type OuthProvider = Exclude<
  MagicLinkAdditionalOptions["oauthOptions"],
  undefined
>["providers"][number];

type SelectionData = string | { provider: OuthProvider };

const MagicUI: React.FC<{
  onSelect: (selection: string | { provider: OuthProvider }) => void;
  emailLogin: boolean;
  smsLogin: boolean;
  oauthProviders?: OuthProvider[];
  modalSize: "compact" | "wide";
}> = (props) => {
  const isEmailEnabled = props.emailLogin !== false;
  const isSMSEnabled = props.smsLogin !== false;

  let placeholder = "Login with email or phone number";
  let type = "text";
  let emptyErrorMessage = "email or phone number is required";
  if (isEmailEnabled && !isSMSEnabled) {
    placeholder = "Login with email address";
    emptyErrorMessage = "email address is required";
    type = "email";
  } else if (!isEmailEnabled && isSMSEnabled) {
    placeholder = "Login with phone number";
    emptyErrorMessage = "phone number is required";
    type = "tel";
  }

  if (!isEmailEnabled && !isSMSEnabled && !props.oauthProviders) {
    throw new Error(
      'MagicLink must have either "emailLogin" or "smsLogin" or social login enabled',
    );
  }

  const showInputUI = isEmailEnabled || isSMSEnabled;
  const screen = useScreenContext();
  const showSeparator =
    props.modalSize === "wide" ||
    (screen !== reservedScreens.main && props.modalSize === "compact");

  return (
    <Container
      flex="column"
      animate="fadein"
      gap={props.modalSize === "compact" ? "lg" : "xl"}
      style={{
        width: "100%",
      }}
    >
      {props.oauthProviders && (
        <>
          {props.oauthProviders.length >= 3 ? (
            <Container gap="md" flex="row" center="x">
              {props.oauthProviders.map((provider) => {
                return (
                  <SocialIconButton
                    key={provider}
                    onClick={() => {
                      props.onSelect({ provider });
                    }}
                  >
                    <ToolTip
                      tip={`Login with ${upperCaseFirstLetter(provider)}`}
                      sideOffset={15}
                    >
                      <div>
                        <Img
                          src={providerImages[provider]}
                          width={iconSize.lg}
                          height={iconSize.lg}
                          alt=""
                        />
                      </div>
                    </ToolTip>
                  </SocialIconButton>
                );
              })}
            </Container>
          ) : (
            <Container gap="xs" flex="column">
              {props.oauthProviders.map((provider) => {
                return (
                  <SocialButtonLarge
                    key={provider}
                    variant="secondary"
                    onClick={() => {
                      props.onSelect({ provider });
                    }}
                  >
                    <Img
                      src={providerImages[provider]}
                      width={iconSize.md}
                      height={iconSize.md}
                      alt=""
                    />
                    <span>Login with {upperCaseFirstLetter(provider)}</span>
                  </SocialButtonLarge>
                );
              })}
            </Container>
          )}
        </>
      )}

      {showInputUI && (
        <>
          {showSeparator && (
            <TextDivider>
              <span> OR </span>
            </TextDivider>
          )}
          <InputSelectionUI
            onSelect={props.onSelect}
            placeholder={placeholder}
            name="magic-input"
            type={type}
            emptyErrorMessage={emptyErrorMessage}
            errorMessage={(input) => {
              const isEmail = input.includes("@");
              const isPhone = Number.isInteger(Number(input[input.length - 1]));

              if (isEmail && isEmailEnabled) {
                const emailRegex =
                  /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
                const isValidEmail = emailRegex.test(input.replace(/\+/g, ""));
                if (!isValidEmail) {
                  return "Invalid email address";
                }
              } else if (isPhone && isSMSEnabled) {
                if (!input.startsWith("+")) {
                  return "Phone number must start with a country code";
                }
              } else {
                if (isEmailEnabled && isSMSEnabled) {
                  return "Invalid email address or phone number";
                }
                if (isEmailEnabled) {
                  return "Invalid email address";
                }
                if (isSMSEnabled) {
                  return "Invalid phone number";
                }
              }
            }}
          />
        </>
      )}
    </Container>
  );
};

function useConnectMagic() {
  const connect = useConnect();

  const connector = useCallback(
    async (data: {
      selectionData: SelectionData;
      walletConfig: WalletConfig<MagicLink>;
      singleWallet: boolean;
      type: "auth" | "connect";
      show: () => void;
      connected: () => void;
      hide: () => void;
    }) => {
      const {
        selectionData,
        walletConfig,
        singleWallet,
        connected,
        show,
        hide,
      } = data;

      if (typeof selectionData === "object") {
        try {
          hide();
          (async () => {
            await connect(walletConfig, {
              oauthProvider: selectionData.provider,
            });
          })();
          connected();
        } catch {
          if (!singleWallet) {
            show();
          }
        }

        return;
      }

      const isEmail = selectionData
        ? (selectionData as string).includes("@")
        : false;

      (async () => {
        hide();
        try {
          await connect(
            walletConfig,
            data.type === "connect"
              ? {}
              : isEmail
              ? { email: selectionData }
              : { phoneNumber: selectionData },
          );
          connected();
        } catch (e) {
          if (!singleWallet) {
            show();
          }
          console.error(e);
        }
      })();
    },
    [connect],
  );

  return connector;
}

const MagicConnectingUI: React.FC<
  ConnectUIProps<MagicLink> & { type: "auth" | "connect" }
> = ({
  connected,
  walletConfig,
  show,
  selectionData,
  supportedWallets,
  type,
  hide,
}) => {
  const connectPrompted = useRef(false);
  const singleWallet = supportedWallets.length === 1;
  const connectMagic = useConnectMagic();

  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectPrompted.current = true;

    connectMagic({
      selectionData: selectionData as SelectionData,
      singleWallet,
      type,
      walletConfig,
      show,
      connected,
      hide,
    });
  }, [
    connectMagic,
    connected,
    selectionData,
    show,
    singleWallet,
    type,
    walletConfig,
    hide,
  ]);

  return (
    <Container
      flex="row"
      center="both"
      style={{
        minHeight: "350px",
      }}
    >
      <Spinner size="xl" color="accentText" />
    </Container>
  );
};

const MagicConnectionUIScreen: React.FC<
  ConnectUIProps<MagicLink> & {
    type: "auth" | "connect";
    emailLogin: boolean;
    smsLogin: boolean;
    oauthProviders?: OuthProvider[];
  }
> = (props) => {
  const connectMagic = useConnectMagic();

  return (
    <Container
      p="lg"
      fullHeight
      flex="column"
      style={{
        minHeight: "300px",
      }}
    >
      <ModalHeader onBack={props.goBack} title="Sign in" />
      <Spacer y="xl" />
      <Container
        expand
        flex="column"
        center="both"
        px={props.modalSize === "wide" ? "lg" : undefined}
      >
        <MagicUI
          {...props}
          onSelect={(data) => {
            connectMagic({
              selectionData: data,
              connected: props.connected,
              show: props.show,
              singleWallet: props.supportedWallets.length === 1,
              type: props.type,
              walletConfig: props.walletConfig,
              hide: props.hide,
            });
          }}
        />
      </Container>
    </Container>
  );
};

const providerImages: Record<OuthProvider, string> = {
  google:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MDUuNiIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxODYuNjkgMTkwLjUiIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTE4NC41ODMgNzY1LjE3MSkiPjxwYXRoIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIgZD0iTS0xMDg5LjMzMy02ODcuMjM5djM2Ljg4OGg1MS4yNjJjLTIuMjUxIDExLjg2My05LjAwNiAyMS45MDgtMTkuMTM3IDI4LjY2MmwzMC45MTMgMjMuOTg2YzE4LjAxMS0xNi42MjUgMjguNDAyLTQxLjA0NCAyOC40MDItNzAuMDUyIDAtNi43NTQtLjYwNi0xMy4yNDktMS43MzItMTkuNDgzeiIgZmlsbD0iIzQyODVmNCIvPjxwYXRoIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIgZD0iTS0xMTQyLjcxNC02NTEuNzkxbC02Ljk3MiA1LjMzNy0yNC42NzkgMTkuMjIzaDBjMTUuNjczIDMxLjA4NiA0Ny43OTYgNTIuNTYxIDg1LjAzIDUyLjU2MSAyNS43MTcgMCA0Ny4yNzgtOC40ODYgNjMuMDM4LTIzLjAzM2wtMzAuOTEzLTIzLjk4NmMtOC40ODYgNS43MTUtMTkuMzEgOS4xNzktMzIuMTI1IDkuMTc5LTI0Ljc2NSAwLTQ1LjgwNi0xNi43MTItNTMuMzQtMzkuMjI2eiIgZmlsbD0iIzM0YTg1MyIvPjxwYXRoIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIgZD0iTS0xMTc0LjM2NS03MTIuNjFjLTYuNDk0IDEyLjgxNS0xMC4yMTcgMjcuMjc2LTEwLjIxNyA0Mi42ODlzMy43MjMgMjkuODc0IDEwLjIxNyA0Mi42ODljMCAuMDg2IDMxLjY5My0yNC41OTIgMzEuNjkzLTI0LjU5Mi0xLjkwNS01LjcxNS0zLjAzMS0xMS43NzYtMy4wMzEtMTguMDk4czEuMTI2LTEyLjM4MyAzLjAzMS0xOC4wOTh6IiBmaWxsPSIjZmJiYzA1Ii8+PHBhdGggZD0iTS0xMDg5LjMzMy03MjcuMjQ0YzE0LjAyOCAwIDI2LjQ5NyA0Ljg0OSAzNi40NTUgMTQuMjAxbDI3LjI3Ni0yNy4yNzZjLTE2LjUzOS0xNS40MTMtMzguMDEzLTI0Ljg1Mi02My43MzEtMjQuODUyLTM3LjIzNCAwLTY5LjM1OSAyMS4zODgtODUuMDMyIDUyLjU2MWwzMS42OTIgMjQuNTkyYzcuNTMzLTIyLjUxNCAyOC41NzUtMzkuMjI2IDUzLjM0LTM5LjIyNnoiIGZpbGw9IiNlYTQzMzUiIGNsaXAtcGF0aD0ibm9uZSIgbWFzaz0ibm9uZSIvPjwvZz48L3N2Zz4=",
  facebook:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iRWJlbmUgMSIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgaWQ9ImZhY2Vib29rLWxvZ28tMjAxOSI+PHBhdGggZmlsbD0iIzE4NzdmMiIgZD0iTTEwMjQsNTEyQzEwMjQsMjI5LjIzMDE2LDc5NC43Njk3OCwwLDUxMiwwUzAsMjI5LjIzMDE2LDAsNTEyYzAsMjU1LjU1NCwxODcuMjMxLDQ2Ny4zNzAxMiw0MzIsNTA1Ljc3Nzc3VjY2MEgzMDJWNTEySDQzMlYzOTkuMkM0MzIsMjcwLjg3OTgyLDUwOC40Mzg1NCwyMDAsNjI1LjM4OTIyLDIwMCw2ODEuNDA3NjUsMjAwLDc0MCwyMTAsNzQwLDIxMFYzMzZINjc1LjQzNzEzQzYxMS44MzUwOCwzMzYsNTkyLDM3NS40NjY2Nyw1OTIsNDE1Ljk1NzI4VjUxMkg3MzRMNzExLjMsNjYwSDU5MnYzNTcuNzc3NzdDODM2Ljc2OSw5NzkuMzcwMTIsMTAyNCw3NjcuNTU0LDEwMjQsNTEyWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik03MTEuMyw2NjAsNzM0LDUxMkg1OTJWNDE1Ljk1NzI4QzU5MiwzNzUuNDY2NjcsNjExLjgzNTA4LDMzNiw2NzUuNDM3MTMsMzM2SDc0MFYyMTBzLTU4LjU5MjM1LTEwLTExNC42MTA3OC0xMEM1MDguNDM4NTQsMjAwLDQzMiwyNzAuODc5ODIsNDMyLDM5OS4yVjUxMkgzMDJWNjYwSDQzMnYzNTcuNzc3NzdhNTE3LjM5NjE5LDUxNy4zOTYxOSwwLDAsMCwxNjAsMFY2NjBaIj48L3BhdGg+PC9zdmc+",
  twitter:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgaWQ9InR3aXR0ZXIiPjxwYXRoIGZpbGw9IiMwM0E5RjQiIGQ9Ik0xNiAzLjUzOWE2LjgzOSA2LjgzOSAwIDAgMS0xLjg5LjUxOCAzLjI2MiAzLjI2MiAwIDAgMCAxLjQ0My0xLjgxMyA2LjU1NSA2LjU1NSAwIDAgMS0yLjA4Ljc5NCAzLjI4IDMuMjggMCAwIDAtNS42NzQgMi4yNDNjMCAuMjYuMDIyLjUxLjA3Ni43NDhhOS4yODQgOS4yODQgMCAwIDEtNi43NjEtMy40MzEgMy4yODUgMy4yODUgMCAwIDAgMS4wMDggNC4zODRBMy4yNCAzLjI0IDAgMCAxIC42NCA2LjU3OHYuMDM2YTMuMjk1IDMuMjk1IDAgMCAwIDIuNjI4IDMuMjIzIDMuMjc0IDMuMjc0IDAgMCAxLS44Ni4xMDggMi45IDIuOSAwIDAgMS0uNjIxLS4wNTYgMy4zMTEgMy4zMTEgMCAwIDAgMy4wNjUgMi4yODUgNi41OSA2LjU5IDAgMCAxLTQuMDY3IDEuMzk5Yy0uMjY5IDAtLjUyNy0uMDEyLS43ODUtLjA0NUE5LjIzNCA5LjIzNCAwIDAgMCA1LjAzMiAxNWM2LjAzNiAwIDkuMzM2LTUgOS4zMzYtOS4zMzQgMC0uMTQ1LS4wMDUtLjI4NS0uMDEyLS40MjRBNi41NDQgNi41NDQgMCAwIDAgMTYgMy41Mzl6Ij48L3BhdGg+PC9zdmc+",
  github:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEwXzIpIj4KPHBhdGggZD0iTTcuOTk5IDBDMy41ODIwMSAwIDQuNjE2NDhlLTA2IDMuNTk2IDQuNjE2NDhlLTA2IDguMDMyQy0wLjAwMTggOS43MTU1NSAwLjUyNTUxOSAxMS4zNTcxIDEuNTA3NDQgMTIuNzI0NkMyLjQ4OTM1IDE0LjA5MjIgMy44NzYyMSAxNS4xMTY2IDUuNDcyIDE1LjY1M0M1Ljg3MiAxNS43MjcgNi4wMTggMTUuNDc5IDYuMDE4IDE1LjI2NkM2LjAxOCAxNS4wNzUgNi4wMTEgMTQuNTcgNi4wMDcgMTMuOUMzLjc4MiAxNC4zODUgMy4zMTIgMTIuODIzIDMuMzEyIDEyLjgyM0MyLjk0OSAxMS44OTUgMi40MjQgMTEuNjQ4IDIuNDI0IDExLjY0OEMxLjY5NyAxMS4xNSAyLjQ3OCAxMS4xNiAyLjQ3OCAxMS4xNkMzLjI4MSAxMS4yMTcgMy43MDMgMTEuOTg4IDMuNzAzIDExLjk4OEM0LjQxNyAxMy4yMTUgNS41NzYgMTIuODYxIDYuMDMyIDEyLjY1NUM2LjEwNCAxMi4xMzYgNi4zMTEgMTEuNzgyIDYuNTQgMTEuNTgxQzQuNzY0IDExLjM3OCAyLjg5NiAxMC42ODkgMi44OTYgNy42MTJDMi44OTYgNi43MzUgMy4yMDggNi4wMTggMy43MiA1LjQ1NkMzLjYzNyA1LjI1MyAzLjM2MyA0LjQzNiAzLjc5OCAzLjMzMUMzLjc5OCAzLjMzMSA0LjQ3IDMuMTE1IDUuOTk4IDQuMTU0QzYuNjUwNzUgMy45NzU2MSA3LjMyNDMyIDMuODg0ODIgOC4wMDEwMSAzLjg4NEM4LjY3NzcyIDMuODg1MzQgOS4zNTEyNiAzLjk3NjQ3IDEwLjAwNCA0LjE1NUMxMS41MzEgMy4xMTYgMTIuMjAyIDMuMzMyIDEyLjIwMiAzLjMzMkMxMi42MzggNC40MzggMTIuMzY0IDUuMjU0IDEyLjI4MiA1LjQ1N0MxMi43OTUgNi4wMTkgMTMuMTA0IDYuNzM2IDEzLjEwNCA3LjYxM0MxMy4xMDQgMTAuNjk4IDExLjIzNCAxMS4zNzcgOS40NTIgMTEuNTc2QzkuNzM5IDExLjgyNCA5Ljk5NSAxMi4zMTQgOS45OTUgMTMuMDYzQzkuOTk1IDE0LjEzNyA5Ljk4NSAxNS4wMDMgOS45ODUgMTUuMjY2QzkuOTg1IDE1LjQ4MSAxMC4xMjkgMTUuNzMxIDEwLjUzNSAxNS42NTJDMTIuMTI5MiAxNS4xMTQzIDEzLjUxNDQgMTQuMDg5NSAxNC40OTQ5IDEyLjcyMjNDMTUuNDc1NSAxMS4zNTUxIDE2LjAwMTkgOS43MTQ0OCAxNiA4LjAzMkMxNiAzLjU5NiAxMi40MTggMCA3Ljk5OSAwWiIgZmlsbD0iIzhCOEI4QiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEwXzIiPgo8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
  apple:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDM4IiBoZWlnaHQ9IjI1MDAiIHZpZXdCb3g9IjAgMCA0OTYuMjU1IDYwOC43MjgiIGlkPSJhcHBsZSI+PHBhdGggZmlsbD0iIzk5OSIgZD0iTTI3My44MSA1Mi45NzNDMzEzLjgwNi4yNTcgMzY5LjQxIDAgMzY5LjQxIDBzOC4yNzEgNDkuNTYyLTMxLjQ2MyA5Ny4zMDZjLTQyLjQyNiA1MC45OC05MC42NDkgNDIuNjM4LTkwLjY0OSA0Mi42MzhzLTkuMDU1LTQwLjA5NCAyNi41MTItODYuOTcxek0yNTIuMzg1IDE3NC42NjJjMjAuNTc2IDAgNTguNzY0LTI4LjI4NCAxMDguNDcxLTI4LjI4NCA4NS41NjIgMCAxMTkuMjIyIDYwLjg4MyAxMTkuMjIyIDYwLjg4M3MtNjUuODMzIDMzLjY1OS02NS44MzMgMTE1LjMzMWMwIDkyLjEzMyA4Mi4wMSAxMjMuODg1IDgyLjAxIDEyMy44ODVzLTU3LjMyOCAxNjEuMzU3LTEzNC43NjIgMTYxLjM1N2MtMzUuNTY1IDAtNjMuMjE1LTIzLjk2Ny0xMDAuNjg4LTIzLjk2Ny0zOC4xODggMC03Ni4wODQgMjQuODYxLTEwMC43NjYgMjQuODYxQzg5LjMzIDYwOC43MyAwIDQ1NS42NjYgMCAzMzIuNjI4YzAtMTIxLjA1MiA3NS42MTItMTg0LjU1NCAxNDYuNTMzLTE4NC41NTQgNDYuMTA1IDAgODEuODgzIDI2LjU4OCAxMDUuODUyIDI2LjU4OHoiPjwvcGF0aD48L3N2Zz4=",
  linkedin:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSI0MCIgaWQ9ImxpbmtlZGluIj48cGF0aCBmaWxsPSIjMDA3RUJCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00NCA0MGgtOS43MjVWMjUuOTM4YzAtMy42OC0xLjUyLTYuMTkzLTQuODY2LTYuMTkzLTIuNTU4IDAtMy45ODEgMS42OTYtNC42NDMgMy4zMy0uMjQ5LjU4Ni0uMjEgMS40MDMtLjIxIDIuMjJWNDBoLTkuNjM0cy4xMjQtMjQuOTA5IDAtMjcuMTczaDkuNjM0djQuMjY1Yy41Ny0xLjg2NSAzLjY0OC00LjUyNiA4LjU2LTQuNTI2QzM5LjIxMSAxMi41NjYgNDQgMTYuNDc0IDQ0IDI0Ljg5MVY0MHpNNS4xOCA5LjQyOGgtLjA2M0MyLjAxMyA5LjQyOCAwIDcuMzUxIDAgNC43MTggMCAyLjAzNCAyLjA3MiAwIDUuMjM5IDBjMy4xNjQgMCA1LjExIDIuMDI5IDUuMTcxIDQuNzEgMCAyLjYzMy0yLjAwNyA0LjcxOC01LjIzIDQuNzE4em0tNC4wNyAzLjM5OWg4LjU3NlY0MEgxLjExVjEyLjgyN3oiPjwvcGF0aD48L3N2Zz4=",
  bitbucket:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgaWQ9ImJpdGJ1Y2tldCI+PHBhdGggZmlsbD0iIzI2ODBGOCIgZD0iTTQuMjk3IDIzaDE1LjY1OWEuNzc2Ljc3NiAwIDAgMCAuNzY5LS42NTdMMjMuOTkgMS45MTZhLjc4Ljc4IDAgMCAwLS42MzUtLjg5NyAxLjEzIDEuMTMgMCAwIDAtLjEzNC0uMDA5TC43NzkgMUEuNzc1Ljc3NSAwIDAgMCAwIDEuNzc1YzAgLjA0NC4wMDUuMDkzLjAwOS4xMzdsMy4yNjUgMjAuMTk2Yy4wODIuNTA5LjUxNS44ODcgMS4wMjMuODkyek0xNS43MzYgOC4zOTFsLTEuMjExIDcuMjA1aC01TDguMTczIDguMzkxaDcuNTYzeiI+PC9wYXRoPjwvc3ZnPg==",
  gitlab:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjIzMDUiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAyNTYgMjM2IiBpZD0iZ2l0bGFiIj48cGF0aCBmaWxsPSIjRTI0MzI5IiBkPSJNMTI4LjA3NSAyMzYuMDc1bDQ3LjEwNC0xNDQuOTdIODAuOTdsNDcuMTA0IDE0NC45N3oiPjwvcGF0aD48cGF0aCBmaWxsPSIjRkM2RDI2IiBkPSJNMTI4LjA3NSAyMzYuMDc0TDgwLjk3IDkxLjEwNEgxNC45NTZsMTEzLjExOSAxNDQuOTd6Ij48L3BhdGg+PHBhdGggZmlsbD0iI0ZDQTMyNiIgZD0iTTE0Ljk1NiA5MS4xMDRMLjY0MiAxMzUuMTZhOS43NTIgOS43NTIgMCAwIDAgMy41NDIgMTAuOTAzbDEyMy44OTEgOTAuMDEyLTExMy4xMi0xNDQuOTd6Ij48L3BhdGg+PHBhdGggZmlsbD0iI0UyNDMyOSIgZD0iTTE0Ljk1NiA5MS4xMDVIODAuOTdMNTIuNjAxIDMuNzljLTEuNDYtNC40OTMtNy44MTYtNC40OTItOS4yNzUgMGwtMjguMzcgODcuMzE1eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGQzZEMjYiIGQ9Ik0xMjguMDc1IDIzNi4wNzRsNDcuMTA0LTE0NC45N2g2Ni4wMTVsLTExMy4xMiAxNDQuOTd6Ij48L3BhdGg+PHBhdGggZmlsbD0iI0ZDQTMyNiIgZD0iTTI0MS4xOTQgOTEuMTA0bDE0LjMxNCA0NC4wNTZhOS43NTIgOS43NTIgMCAwIDEtMy41NDMgMTAuOTAzbC0xMjMuODkgOTAuMDEyIDExMy4xMTktMTQ0Ljk3eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNFMjQzMjkiIGQ9Ik0yNDEuMTk0IDkxLjEwNWgtNjYuMDE1bDI4LjM3LTg3LjMxNWMxLjQ2LTQuNDkzIDcuODE2LTQuNDkyIDkuMjc1IDBsMjguMzcgODcuMzE1eiI+PC9wYXRoPjwvc3ZnPg==",
  twitch:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDExMS43ODY2NyAxMjcuMzg2NjciCiAgIGhlaWdodD0iMTI3LjM4NjY3IgogICB3aWR0aD0iMTExLjc4NjY3IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczMzU1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJUd2l0Y2hfbG9nby5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4xICgzYmY1YWUwZDI1LCAyMDIxLTA5LTIwKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcwogICBpZD0iZGVmczI5Ij4KICAgIAogICAgCiAgPC9kZWZzPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgaWQ9Im5hbWVkdmlldzI3IgogICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgIHNob3dncmlkPSJmYWxzZSIKICAgaW5rc2NhcGU6em9vbT0iNC4xOTkyMjg0IgogICBpbmtzY2FwZTpjeD0iLTUwLjYwNDUzNSIKICAgaW5rc2NhcGU6Y3k9IjE0MC4zODI5MyIKICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIyNTYwIgogICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMzg3IgogICBpbmtzY2FwZTp3aW5kb3cteD0iMTkxMiIKICAgaW5rc2NhcGU6d2luZG93LXk9Ii04IgogICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmczMzU1IiAvPgogIDxnCiAgIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMzMzMywwLDAsLTEuMzMzMzMzMywxMDEuMzkzMzMsNjcuNTg5MzMyKSIKICAgaWQ9ImczMzY1Ij4KICAgICAgPHBhdGgKICAgaWQ9InBhdGgzMzY3IgogICBzdHlsZT0iZmlsbDojNjQ0MWE1O2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpub25lIgogICBkPSJtIDAsMCAtMTMuNjUyLC0xMy42NTEgaCAtMjEuNDQ1IGwgLTExLjY5OSwtMTEuNjk3IHYgMTEuNjk3IEggLTY0LjM0NCBWIDQyLjg5MyBIIDAgWiBtIC03Mi4xNDYsNTAuNjkyIC0zLjg5OSwtMTUuNTk5IHYgLTcwLjE5IGggMTcuNTUgdiAtOS43NTEgaCA5Ljc0NiBsIDkuNzUyLDkuNzUxIGggMTUuNTk2IEwgNy43OTUsLTMuOTA1IHYgNTQuNTk3IHoiIC8+CiAgICA8L2c+PHBhdGgKICAgaWQ9InBhdGgzMzY5IgogICBzdHlsZT0iZmlsbDojNjQ0MWE1O2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICBkPSJtIDQ0LjE5NzMzMSw2Mi4zOTQyNjYgaCAxMC4zOTg2NyBWIDMxLjE5MjkzMyBoIC0xMC4zOTg2NyB6IG0gMjguNTk0NjcsMCBoIDEwLjM5ODY2IFYgMzEuMTkyOTMzIGggLTEwLjM5ODY2IHoiIC8+Cjwvc3ZnPgo=",
  discord:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEwMCAxMDAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBpZD0iZGlzY29yZCI+PHBhdGggZmlsbD0iIzY2NjVkMiIgZD0iTTg1LjIyLDI0Ljk1OGMtMTEuNDU5LTguNTc1LTIyLjQzOC04LjMzNC0yMi40MzgtOC4zMzRsLTEuMTIyLDEuMjgyCgkJCQljMTMuNjIzLDQuMDg3LDE5Ljk1NCwxMC4wOTcsMTkuOTU0LDEwLjA5N2MtMTkuNDkxLTEwLjczMS00NC4zMTctMTAuNjU0LTY0LjU5LDBjMCwwLDYuNTcxLTYuMzMxLDIwLjk5Ni0xMC40MThsLTAuODAxLTAuOTYyCgkJCQljMCwwLTEwLjg5OS0wLjI0LTIyLjQzOCw4LjMzNGMwLDAtMTEuNTQsMjAuNzU1LTExLjU0LDQ2LjMxOWMwLDAsNi43MzIsMTEuNTQsMjQuNDQyLDEyLjEwMWMwLDAsMi45NjUtMy41MjYsNS4zNjktNi41NzEKCQkJCWMtMTAuMTc3LTMuMDQ1LTE0LjAyNC05LjM3Ni0xNC4wMjQtOS4zNzZjNi4zOTQsNC4wMDEsMTIuODU5LDYuNTA1LDIwLjkxNiw4LjA5NGMxMy4xMDgsMi42OTgsMjkuNDEzLTAuMDc2LDQxLjU5MS04LjA5NAoJCQkJYzAsMC00LjAwNyw2LjQ5MS0xNC41MDUsOS40NTZjMi40MDQsMi45NjUsNS4yODksNi40MTEsNS4yODksNi40MTFjMTcuNzEtMC41NjEsMjQuNDQxLTEyLjEwMSwyNC40NDEtMTIuMDIKCQkJCUM5Ni43NTksNDUuNzEzLDg1LjIyLDI0Ljk1OCw4NS4yMiwyNC45NTh6IE0zNS4wNTUsNjMuODI0Yy00LjQ4OCwwLTguMTc0LTMuOTI3LTguMTc0LTguODE1CgkJCQljMC4zMjgtMTEuNzA3LDE2LjEwMi0xMS42NzEsMTYuMzQ4LDBDNDMuMjI5LDU5Ljg5NywzOS42MjIsNjMuODI0LDM1LjA1NSw2My44MjR6IE02NC4zMDQsNjMuODI0CgkJCQljLTQuNDg4LDAtOC4xNzQtMy45MjctOC4xNzQtOC44MTVjMC4zNi0xMS42ODQsMTUuOTM3LTExLjY4OSwxNi4zNDgsMEM3Mi40NzgsNTkuODk3LDY4Ljg3Miw2My44MjQsNjQuMzA0LDYzLjgyNHoiPjwvcGF0aD48L3N2Zz4=",
  microsoft:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNmZjU3MjIiIGQ9Ik02IDZIMjJWMjJINnoiIHRyYW5zZm9ybT0icm90YXRlKC0xODAgMTQgMTQpIi8+PHBhdGggZmlsbD0iIzRjYWY1MCIgZD0iTTI2IDZINDJWMjJIMjZ6IiB0cmFuc2Zvcm09InJvdGF0ZSgtMTgwIDM0IDE0KSIvPjxwYXRoIGZpbGw9IiNmZmMxMDciIGQ9Ik0yNiAyNkg0MlY0MkgyNnoiIHRyYW5zZm9ybT0icm90YXRlKC0xODAgMzQgMzQpIi8+PHBhdGggZmlsbD0iIzAzYTlmNCIgZD0iTTYgMjZIMjJWNDJINnoiIHRyYW5zZm9ybT0icm90YXRlKC0xODAgMTQgMzQpIi8+PC9zdmc+",
};

function upperCaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const SocialButtonLarge = /* @__PURE__ */ styled(Button)<{ theme?: Theme }>`
  display: flex;
  justify-content: flex-start;
  gap: ${spacing.md};
  font-size: ${fontSize.md};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(p) => p.theme.colors.secondaryButtonBg};
  }
  &:active {
    box-shadow: none;
  }
`;

const SocialIconButton = /* @__PURE__ */ styled(IconButton)<{ theme?: Theme }>`
  border: 1px solid ${(p) => p.theme.colors.borderColor};
  padding: ${spacing.xs};
`;
