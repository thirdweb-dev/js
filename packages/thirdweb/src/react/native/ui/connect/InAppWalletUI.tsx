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
import { ThemedButton, ThemedButtonWithIcon } from "../components/button.js";
import { ThemedInput, ThemedInputWithSubmit } from "../components/input.js";
import { RNImage } from "../components/RNImage.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { getAuthProviderImage } from "../components/WalletImage.js";
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
  apple: APPLE_ICON,
  coinbase: COINBASE_ICON,
  discord: DISCORD_ICON,
  facebook: FACEBOOK_ICON,
  farcaster: FARCASTER_ICON,
  github: GITHUB_ICON,
  google: GOOGLE_ICON,
  line: LINE_ICON,
  steam: STEAM_ICON,
  telegram: TELEGRAM_ICON,
  twitch: TWITCH_ICON,
  x: X_ICON,
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
          <SocialLogin auth={auth} key={auth} {...props} />
        ))}
      </View>
      {authOptions.includes("email") ? (
        inputMode === "email" ? (
          <PreOtpLogin auth="email" {...props} />
        ) : (
          <ThemedButtonWithIcon
            icon={getAuthProviderImage("email")}
            onPress={() => setInputMode("email")}
            theme={theme}
            title="Email address"
          />
        )
      ) : null}
      {authOptions.includes("phone") ? (
        inputMode === "phone" ? (
          <PreOtpLogin auth="phone" {...props} />
        ) : (
          <ThemedButtonWithIcon
            icon={getAuthProviderImage("phone")}
            onPress={() => setInputMode("phone")}
            theme={theme}
            title="Phone number"
          />
        )
      ) : null}
      {authOptions.includes("passkey") ? (
        <ThemedButtonWithIcon
          icon={getAuthProviderImage("passkey")}
          onPress={() => {
            props.setScreen({ screen: "passkey", wallet });
          }}
          theme={theme}
          title="Passkey"
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
      authMethod: "guest",
      connectFn: async () => {
        await wallet.connect({
          client,
          strategy: "guest",
        });
        await setLastAuthProvider("guest", nativeLocalStorage);
        return wallet;
      },
      wallet,
    });
  }, [connector, wallet, client]);

  return (
    <ThemedButtonWithIcon
      icon={getAuthProviderImage("guest")}
      onPress={() => {
        connectInAppWallet();
      }}
      theme={theme}
      title="Continue as guest"
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
      authMethod: auth,
      connectFn: async (chain) => {
        await wallet.connect({
          chain,
          client,
          strategy: auth,
        });
        await setLastAuthProvider(auth, nativeLocalStorage);
        return wallet;
      },
      wallet,
    });
  }, [connector, auth, wallet, client]);

  return (
    <TouchableOpacity
      key={strategy}
      onPress={connectInAppWallet}
      style={[
        styles.socialIconContainer,
        { borderColor: theme.colors.borderColor },
      ]}
    >
      <RNImage data={socialIcons[auth]} size={38} theme={theme} />
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
          phoneNumber: phoneOrEmail,
          strategy: auth,
        });
      } else {
        await preAuthenticate({
          client,
          email: phoneOrEmail,
          strategy: auth,
        });
      }
    },
  });

  return (
    <ThemedInputWithSubmit
      isSubmitting={sendCode.isPending}
      keyboardType={auth === "phone" ? "phone-pad" : "email-address"}
      onChangeText={setPhoneNumberOrEmail}
      onSubmit={() =>
        sendCode.mutate(
          {
            auth,
            phoneOrEmail,
          },
          {
            onError: (error) => {
              // TODO (rn) - handle error toast or input error border/label
              Alert.alert("Error", error.message);
            },
            onSuccess: (_, vars) => {
              if (vars.auth === "phone") {
                setScreen({
                  auth: {
                    phoneNumber: vars.phoneOrEmail,
                    strategy: vars.auth,
                  },
                  screen: "otp",
                  wallet,
                });
              } else {
                setScreen({
                  auth: { email: vars.phoneOrEmail, strategy: vars.auth },
                  screen: "otp",
                  wallet,
                });
              }
            },
          },
        )
      }
      placeholder={auth === "phone" ? "Phone number" : "Email address"}
      theme={theme}
      value={phoneOrEmail}
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
      authMethod: auth.strategy,
      connectFn: async (chain) => {
        if (auth.strategy === "phone") {
          await wallet.connect({
            chain,
            client,
            phoneNumber: auth.phoneNumber,
            strategy: auth.strategy,
            verificationCode,
          });
        } else {
          await wallet.connect({
            chain,
            client,
            email: auth.email,
            strategy: auth.strategy,
            verificationCode,
          });
        }
        await setLastAuthProvider(auth.strategy, nativeLocalStorage);
        return wallet;
      },
      wallet,
    });
  };

  return (
    <>
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ThemedText style={{ color: theme.colors.secondaryText }} theme={theme}>
          Enter the verification code sent to
        </ThemedText>
        <ThemedText theme={theme} type="defaultSemiBold">
          {auth.strategy === "phone" ? auth.phoneNumber : auth.email}
        </ThemedText>
      </View>
      <Spacer size="xs" />
      <ThemedInput
        keyboardType="number-pad"
        onChangeText={setVerificationCode}
        placeholder="Verification code"
        theme={theme}
        value={verificationCode}
      />
      <ThemedButton onPress={connectInAppWallet} theme={theme} variant="accent">
        <ThemedText
          style={{ color: theme.colors.accentButtonText }}
          theme={theme}
          type="defaultSemiBold"
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
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          padding: spacing.xl,
        }}
      >
        <RNImage
          color={theme.colors.accentButtonBg}
          data={getAuthProviderImage("passkey")}
          size={90}
          theme={theme}
        />
        <Spacer size="xxl" />
        <ThemedButton
          onPress={async () => {
            setScreen("signup");
          }}
          style={{ width: "100%" }}
          theme={theme}
          variant="accent"
        >
          <ThemedText
            style={{
              color: theme.colors.accentButtonText,
            }}
            theme={theme}
            type="defaultSemiBold"
          >
            Create a Passkey
          </ThemedText>
        </ThemedButton>
        <Spacer size="md" />
        <ThemedButton
          onPress={async () => {
            setScreen("login");
          }}
          style={{ width: "100%" }}
          theme={theme}
          variant="secondary"
        >
          <ThemedText
            style={{
              color: theme.colors.secondaryButtonText,
            }}
            theme={theme}
            type="defaultSemiBold"
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
        authMethod: "passkey",
        connectFn: async (chain) => {
          await wallet.connect({
            chain,
            client,
            strategy: "passkey",
            type,
          });
          await setLastAuthProvider("passkey", nativeLocalStorage);
          return wallet;
        },
        wallet,
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
    alignItems: "center",
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: 1,
    flex: 1,
    flexDirection: "column",
    height: 60,
    justifyContent: "center",
  },
});
