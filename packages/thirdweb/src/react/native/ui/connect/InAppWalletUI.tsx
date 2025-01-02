import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import type {
  MultiStepAuthProviderType,
  PreAuthArgsType,
} from "../../../../wallets/in-app/core/authentication/types.js";
import type {
  InAppWalletAuth,
  InAppWalletSocialAuth,
} from "../../../../wallets/in-app/core/wallet/types.js";
import { preAuthenticate } from "../../../../wallets/in-app/native/auth/index.js";
import { hasStoredPasskey } from "../../../../wallets/in-app/native/auth/passkeys.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  type SocialAuthOption,
  socialAuthOptions,
} from "../../../../wallets/types.js";
import type { Theme } from "../../../core/design-system/index.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import { radius, spacing } from "../../design-system/index.js";
import { RNImage } from "../components/RNImage.js";
import { getAuthProviderImage } from "../components/WalletImage.js";
import { ThemedButton, ThemedButtonWithIcon } from "../components/button.js";
import { ThemedInput, ThemedInputWithSubmit } from "../components/input.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import {
  APPLE_ICON,
  COINBASE_ICON,
  DISCORD_ICON,
  FACEBOOK_ICON,
  FARCASTER_ICON,
  GITHUB_ICON,
  GOOGLE_ICON,
  LINE_ICON,
  STEAM_ICON,
  TELEGRAM_ICON,
  TWITCH_ICON,
  X_ICON,
} from "../icons/svgs.js";
import type { ModalState } from "./ConnectModal.js";
import { LoadingView } from "./LoadingView.js";

const defaultAuthOptions: InAppWalletAuth[] = [
  "email",
  "phone",
  "passkey",
  "google",
  "facebook",
  "apple",
];

const socialIcons = {
  google: GOOGLE_ICON,
  facebook: FACEBOOK_ICON,
  coinbase: COINBASE_ICON,
  apple: APPLE_ICON,
  discord: DISCORD_ICON,
  line: LINE_ICON,
  x: X_ICON,
  farcaster: FARCASTER_ICON,
  telegram: TELEGRAM_ICON,
  github: GITHUB_ICON,
  twitch: TWITCH_ICON,
  steam: STEAM_ICON,
};

type InAppWalletFormUIProps = {
  client: ThirdwebClient;
  theme: Theme;
  wallet: Wallet<"inApp">;
  setScreen: (screen: ModalState) => void;
  connector: (args: {
    wallet: Wallet;
    connectFn: (chain?: Chain) => Promise<Wallet>;
    authMethod?: InAppWalletAuth;
  }) => Promise<void>;
};

export function InAppWalletUI(props: InAppWalletFormUIProps) {
  const { wallet, theme } = props;
  const config = wallet.getConfig();
  const authOptions = config?.auth?.options || defaultAuthOptions;
  const socialLogins = authOptions.filter((x) =>
    socialAuthOptions.includes(x as SocialAuthOption),
  ) as InAppWalletSocialAuth[];

  const [inputMode, setInputMode] = useState<"email" | "phone">("email");

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {socialLogins.map((auth) => (
          <SocialLogin key={auth} auth={auth} {...props} />
        ))}
      </View>
      {authOptions.includes("email") ? (
        inputMode === "email" ? (
          <PreOtpLogin auth="email" {...props} />
        ) : (
          <ThemedButtonWithIcon
            theme={theme}
            title="Email address"
            icon={getAuthProviderImage("email")}
            onPress={() => setInputMode("email")}
          />
        )
      ) : null}
      {authOptions.includes("phone") ? (
        inputMode === "phone" ? (
          <PreOtpLogin auth="phone" {...props} />
        ) : (
          <ThemedButtonWithIcon
            theme={theme}
            title="Phone number"
            icon={getAuthProviderImage("phone")}
            onPress={() => setInputMode("phone")}
          />
        )
      ) : null}
      {authOptions.includes("passkey") ? (
        <ThemedButtonWithIcon
          theme={theme}
          title="Passkey"
          icon={getAuthProviderImage("passkey")}
          onPress={() => {
            props.setScreen({ screen: "passkey", wallet });
          }}
        />
      ) : null}
      {authOptions.includes("guest") ? <GuestLogin {...props} /> : null}
    </View>
  );
}

function GuestLogin(props: InAppWalletFormUIProps) {
  const { theme, wallet, client, connector } = props;
  const connectInAppWallet = useCallback(() => {
    connector({
      wallet,
      connectFn: async () => {
        await wallet.connect({
          client,
          strategy: "guest",
        });
        await setLastAuthProvider("guest", nativeLocalStorage);
        return wallet;
      },
      authMethod: "guest",
    });
  }, [connector, wallet, client]);

  return (
    <ThemedButtonWithIcon
      theme={theme}
      title="Continue as guest"
      icon={getAuthProviderImage("guest")}
      onPress={() => {
        connectInAppWallet();
      }}
    />
  );
}

function SocialLogin(
  props: InAppWalletFormUIProps & { auth: InAppWalletSocialAuth },
) {
  const { theme, wallet, auth, client, connector } = props;
  // TODO (rn) - move this onPress and state up
  const strategy = props.auth;
  const connectInAppWallet = useCallback(() => {
    connector({
      wallet,
      connectFn: async (chain) => {
        await wallet.connect({
          client,
          strategy: auth,
          chain,
        });
        await setLastAuthProvider(auth, nativeLocalStorage);
        return wallet;
      },
      authMethod: auth,
    });
  }, [connector, auth, wallet, client]);

  return (
    <TouchableOpacity
      style={[
        styles.socialIconContainer,
        { borderColor: theme.colors.borderColor },
      ]}
      key={strategy}
      onPress={connectInAppWallet}
    >
      <RNImage theme={theme} size={38} data={socialIcons[auth]} />
    </TouchableOpacity>
  );
}

function PreOtpLogin(
  props: InAppWalletFormUIProps & {
    auth: PreAuthArgsType["strategy"];
  },
) {
  const { theme, auth, client, setScreen, wallet } = props;
  const [phoneOrEmail, setPhoneNumberOrEmail] = useState("");

  const sendCode = useMutation({
    mutationFn: async (options: {
      auth: PreAuthArgsType["strategy"];
      phoneOrEmail: string;
    }) => {
      const { auth, phoneOrEmail } = options;
      if (auth === "phone") {
        if (phoneOrEmail.slice(0, 1) !== "+") {
          throw new Error(
            "Invalid phone number. Please include a country code.",
          );
        }
        await preAuthenticate({
          client,
          strategy: auth,
          phoneNumber: phoneOrEmail,
        });
      } else {
        await preAuthenticate({
          client,
          strategy: auth,
          email: phoneOrEmail,
        });
      }
    },
  });

  return (
    <ThemedInputWithSubmit
      theme={theme}
      placeholder={auth === "phone" ? "Phone number" : "Email address"}
      onChangeText={setPhoneNumberOrEmail}
      value={phoneOrEmail}
      keyboardType={auth === "phone" ? "phone-pad" : "email-address"}
      onSubmit={() =>
        sendCode.mutate(
          {
            auth,
            phoneOrEmail,
          },
          {
            onSuccess: (_, vars) => {
              if (vars.auth === "phone") {
                setScreen({
                  screen: "otp",
                  auth: {
                    strategy: vars.auth,
                    phoneNumber: vars.phoneOrEmail,
                  },
                  wallet,
                });
              } else {
                setScreen({
                  screen: "otp",
                  auth: { strategy: vars.auth, email: vars.phoneOrEmail },
                  wallet,
                });
              }
            },
            onError: (error) => {
              // TODO (rn) - handle error toast or input error border/label
              Alert.alert("Error", error.message);
            },
          },
        )
      }
      isSubmitting={sendCode.isPending}
    />
  );
}

export function OtpLogin(
  props: InAppWalletFormUIProps & {
    auth: MultiStepAuthProviderType;
  },
) {
  const { theme, auth, wallet, client, connector } = props;
  const [verificationCode, setVerificationCode] = useState("");

  const connectInAppWallet = async () => {
    if (!verificationCode || !verificationCode) return;
    await connector({
      wallet,
      connectFn: async (chain) => {
        if (auth.strategy === "phone") {
          await wallet.connect({
            client,
            strategy: auth.strategy,
            phoneNumber: auth.phoneNumber,
            verificationCode,
            chain,
          });
        } else {
          await wallet.connect({
            client,
            strategy: auth.strategy,
            email: auth.email,
            verificationCode,
            chain,
          });
        }
        await setLastAuthProvider(auth.strategy, nativeLocalStorage);
        return wallet;
      },
      authMethod: auth.strategy,
    });
  };

  return (
    <>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText theme={theme} style={{ color: theme.colors.secondaryText }}>
          Enter the verification code sent to
        </ThemedText>
        <ThemedText theme={theme} type="defaultSemiBold">
          {auth.strategy === "phone" ? auth.phoneNumber : auth.email}
        </ThemedText>
      </View>
      <Spacer size="xs" />
      <ThemedInput
        theme={theme}
        placeholder="Verification code"
        onChangeText={setVerificationCode}
        value={verificationCode}
        keyboardType="number-pad"
      />
      <ThemedButton theme={theme} onPress={connectInAppWallet} variant="accent">
        <ThemedText
          theme={theme}
          type="defaultSemiBold"
          style={{ color: theme.colors.accentButtonText }}
        >
          Verify
        </ThemedText>
      </ThemedButton>
    </>
  );
}

export function PasskeyView(props: InAppWalletFormUIProps) {
  const { theme, wallet, client } = props;

  const [screen, setScreen] = useState<
    "select" | "login" | "loading" | "signup"
  >("loading");

  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) {
      return;
    }
    triggered.current = true;
    hasStoredPasskey(client)
      .then((isStored) => {
        if (isStored) {
          setScreen("login");
        } else {
          setScreen("select");
        }
      })
      .catch(() => {
        setScreen("select");
      });
  }, [client]);

  if (screen === "loading") {
    return <LoadingView theme={theme} />;
  }

  if (screen === "login" || screen === "signup") {
    return (
      <PasskeyLoadingView
        {...props}
        type={screen === "login" ? "sign-in" : "sign-up"}
      />
    );
  }

  return (
    wallet && (
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.xl,
        }}
      >
        <RNImage
          theme={theme}
          size={90}
          data={getAuthProviderImage("passkey")}
          color={theme.colors.accentButtonBg}
        />
        <Spacer size="xxl" />
        <ThemedButton
          theme={theme}
          variant="accent"
          style={{ width: "100%" }}
          onPress={async () => {
            setScreen("signup");
          }}
        >
          <ThemedText
            theme={theme}
            type="defaultSemiBold"
            style={{
              color: theme.colors.accentButtonText,
            }}
          >
            Create a Passkey
          </ThemedText>
        </ThemedButton>
        <Spacer size="md" />
        <ThemedButton
          theme={theme}
          variant="secondary"
          style={{ width: "100%" }}
          onPress={async () => {
            setScreen("login");
          }}
        >
          <ThemedText
            theme={theme}
            type="defaultSemiBold"
            style={{
              color: theme.colors.secondaryButtonText,
            }}
          >
            I have a Passkey
          </ThemedText>
        </ThemedButton>
      </View>
    )
  );
}

function PasskeyLoadingView(
  props: InAppWalletFormUIProps & {
    type: "sign-in" | "sign-up";
  },
) {
  const { theme, type, wallet, client, connector } = props;

  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) {
      return;
    }
    triggered.current = true;
    const connectInAppWallet = async (type: "sign-in" | "sign-up") => {
      await connector({
        wallet,
        connectFn: async (chain) => {
          await wallet.connect({
            client,
            strategy: "passkey",
            type,
            chain,
          });
          await setLastAuthProvider("passkey", nativeLocalStorage);
          return wallet;
        },
        authMethod: "passkey",
      });
    };
    connectInAppWallet(type);
  }, [client, type, wallet, connector]);

  return <LoadingView theme={theme} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-evenly",
  },
  socialIconContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radius.lg,
    height: 60,
  },
});
