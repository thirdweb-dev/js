import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  SelectUIProps,
  WalletOptions,
  useConnect,
} from "@thirdweb-dev/react-core";
import type { ConfiguredMagicLinkWallet } from "./types";
import { useRef, useEffect } from "react";
import { Spinner } from "../../../components/Spinner";
import { Flex } from "../../../components/basic";
import { InputSelectionUI } from "../InputSelectionUI";
import { Img } from "../../../components/Img";
import { iconSize } from "../../../design-system";
import { IconButton } from "../../../components/buttons";
import { ToolTip } from "../../../components/Tooltip";
import { Spacer } from "../../../components/Spacer";

export function magicLink(
  config: MagicLinkAdditionalOptions,
): ConfiguredMagicLinkWallet {
  const selectUI = (props: SelectUIProps<MagicLink>) => (
    <MagicSelectionUI
      {...props}
      emailLogin={config.emailLogin !== false}
      smsLogin={config.smsLogin !== false}
      oauthProviders={config.oauthOptions?.providers}
    />
  );

  return {
    id: MagicLink.id,
    meta: MagicLink.meta,
    create: (options: WalletOptions) =>
      new MagicLink({ ...options, ...config }),
    connectUI(props) {
      return <MagicConnectionUI {...props} type={config.type || "auth"} />;
    },
    // select UI only for auth
    selectUI: config.type === "connect" ? undefined : selectUI,
    isInstalled() {
      return false;
    },
  };
}

type OuthProvider = Exclude<
  MagicLinkAdditionalOptions["oauthOptions"],
  undefined
>["providers"][number];

const MagicSelectionUI: React.FC<
  SelectUIProps<MagicLink> & {
    emailLogin: boolean;
    smsLogin: boolean;
    oauthProviders?: OuthProvider[];
  }
> = (props) => {
  const isEmailEnabled = props.emailLogin !== false;
  const isSMSEnabled = props.smsLogin !== false;

  let placeholder = "Enter your email or phone number";
  let type = "text";
  let emptyErrorMessage = "email or phone number is required";
  if (isEmailEnabled && !isSMSEnabled) {
    placeholder = "Enter your email address";
    emptyErrorMessage = "email address is required";
    type = "email";
  } else if (!isEmailEnabled && isSMSEnabled) {
    placeholder = "Enter your phone number";
    emptyErrorMessage = "phone number is required";
    type = "tel";
  }

  if (!isEmailEnabled && !isSMSEnabled && !props.oauthProviders) {
    throw new Error(
      'MagicLink must have either "emailLogin" or "smsLogin" or social login enabled',
    );
  }

  const noInput = !isEmailEnabled && !isSMSEnabled;

  return (
    <>
      <InputSelectionUI
        onSelect={props.onSelect}
        placeholder={placeholder}
        name="magic-input"
        type={type}
        noInput={!isEmailEnabled && !isSMSEnabled}
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
        supportedWallets={props.supportedWallets}
        footer={
          props.oauthProviders && (
            <>
              {!noInput && <Spacer y="lg" />}
              <Flex gap="md" justifyContent="center" wrap="wrap">
                {props.oauthProviders.map((provider) => {
                  return (
                    <IconButton
                      key={provider}
                      variant="secondary"
                      onClick={() => {
                        props.onSelect({ provider });
                      }}
                    >
                      <ToolTip tip={`Login with ${provider}`}>
                        <div>
                          <Img
                            src={providerImages[provider]}
                            width={iconSize.lg}
                            height={iconSize.lg}
                            alt=""
                          />
                        </div>
                      </ToolTip>
                    </IconButton>
                  );
                })}
              </Flex>
            </>
          )
        }
      />
    </>
  );
};

const MagicConnectionUI: React.FC<
  ConnectUIProps<MagicLink> & { type: "auth" | "connect" }
> = ({ close, walletConfig, open, selectionData, supportedWallets, type }) => {
  const connectPrompted = useRef(false);
  const singleWallet = supportedWallets.length === 1;
  const connect = useConnect();

  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectPrompted.current = true;

    if (typeof selectionData === "object") {
      try {
        (async () => {
          await connect(walletConfig, {
            oauthProvider: selectionData.provider,
          });
        })();
        close();
      } catch {
        if (!singleWallet) {
          open();
        }
      }

      return;
    }

    const isEmail = selectionData
      ? (selectionData as string).includes("@")
      : false;

    (async () => {
      close();
      try {
        await connect(
          walletConfig,
          type === "connect"
            ? {}
            : isEmail
            ? { email: selectionData }
            : { phoneNumber: selectionData },
        );
      } catch (e) {
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [connect, selectionData, walletConfig, close, open, singleWallet, type]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "250px",
      }}
    >
      <Spinner size="md" color="primary" />
    </Flex>
  );
};

const providerImages: Record<OuthProvider, string> = {
  google: "ipfs://QmVrUknakLZxHvWShkuKFDcrsVNXqk2hcTqsSGNhzm3N9Q/google.svg",
  facebook:
    "ipfs://QmNV7pewgWqNSjYfKgiioiiWgbqaASWPjCBLSVdRLYFFVt/facebook.svg",
  twitter:
    "ipfs://QmV3MfkG5H1M8b4mcmhGzg2qZ3NiFHaxeYGUgcCByVTebv/twitter-bird.svg",
  github:
    "ipfs://QmZSbUbp3zvdmDLKJnJ95KwzwGqwnkC7b8MySckuayzKde/github-gray.svg",
  apple: "ipfs://QmYsnTGJQqPLH1E2BwMr22A1jDiMFf1B5cwvbT46wuSVLw/apple.svg",
  linkedin:
    "ipfs://QmdPYRtmMy33oemcwCrqPTNFLVeTZtZkRXmqFftjS8bVdV/linkedin.svg",
  bitbucket:
    "ipfs://QmW7Uzid7wMhp2JeTXrzanWTTP6CKLin66cMDZsEppM6Ko/bitbucket.svg",
  gitlab: "ipfs://QmartJd4xmFu9sob4PaBAUACofzVnVrh199TCCWVs3QAzo/gitlab.svg",
  twitch: "ipfs://QmZaeBcAZEFw6wXAW9WBjTZNm3h4dHUB7MorvUau31Gpde/twitch.svg",
  discord: "ipfs://QmaM539rAkvtT2AsEmrbJHL2vJZ3hf9Vtcm6UqNMwfUL1V/discord.svg",
  microsoft:
    "ipfs://QmTCdRwSPQBsHhFq8HSqn8d9aLmE9vESWnFn3VUb7tv85t/micrsoft.svg",
};
