import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import type {
  MultiStepAuthProviderType,
  PreAuthArgsType,
} from "../../../../wallets/in-app/core/authentication/type.js";
import type {
  InAppWalletAuth,
  InAppWalletSocialAuth,
} from "../../../../wallets/in-app/core/wallet/types.js";
import { preAuthenticate } from "../../../../wallets/in-app/native/auth/index.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import { radius, spacing } from "../../design-system/index.js";
import type { useConnect } from "../../hooks/wallets/useConnect.js";
import { RNImage } from "../components/RNImage.js";
import { ThemedButton, ThemedButtonWithIcon } from "../components/button.js";
import { ThemedInput, ThemedInputWithSubmit } from "../components/input.js";
import { Spacer } from "../components/spacer.js";
import { ThemedSpinner } from "../components/spinner.js";
import { ThemedText } from "../components/text.js";
import {
  APPLE_ICON,
  EMAIL_ICON,
  FACEBOOK_ICON,
  GOOGLE_ICON,
  PHONE_ICON,
} from "../icons/svgs.js";
import type { ModalState } from "./ConnectModal.js";

const defaultAuthOptions: InAppWalletAuth[] = [
  "email",
  "phone",
  "google",
  "facebook",
  "apple",
];

const socialIcons = {
  google: GOOGLE_ICON,
  facebook: FACEBOOK_ICON,
  apple: APPLE_ICON,
};

type InAppWalletFormUIProps = {
  client: ThirdwebClient;
  theme: Theme;
  wallet: Wallet<"inApp">;
  setScreen: (screen: ModalState) => void;
  connectMutation: ReturnType<typeof useConnect>;
};

export function InAppWalletUI(props: InAppWalletFormUIProps) {
  const { wallet, theme } = props;
  const config = wallet.getConfig();
  const authOptions = config?.auth?.options || defaultAuthOptions;
  const socialLogins = authOptions.filter(
    (x) => x === "google" || x === "apple" || x === "facebook",
  ) as InAppWalletSocialAuth[];

  const [inputMode, setInputMode] = useState<"email" | "phone">("email");

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {socialLogins.map((auth) => (
          <SocialLogin key={auth} auth={auth} {...props} />
        ))}
      </View>
      {inputMode === "email" ? (
        <PreOtpLogin auth="email" {...props} />
      ) : (
        <ThemedButtonWithIcon
          theme={theme}
          title="Email address"
          icon={EMAIL_ICON}
          onPress={() => setInputMode("email")}
        />
      )}
      {inputMode === "phone" ? (
        <PreOtpLogin auth="phone" {...props} />
      ) : (
        <ThemedButtonWithIcon
          theme={theme}
          title="Phone number"
          icon={PHONE_ICON}
          onPress={() => setInputMode("phone")}
        />
      )}
    </View>
  );
}

function SocialLogin(
  props: InAppWalletFormUIProps & { auth: InAppWalletSocialAuth },
) {
  const { theme, wallet, auth, client, connectMutation } = props;
  const strategy = props.auth;
  const [selectedAuth, setSelectedAuth] = useState<InAppWalletSocialAuth>();
  const connectInAppWallet = async () => {
    setSelectedAuth(strategy);
    await connectMutation.connect(async () => {
      await wallet.connect({
        client,
        strategy: auth,
      });
      await setLastAuthProvider(auth, nativeLocalStorage);
      return wallet;
    });
  };

  return (
    <View
      style={[
        styles.socialIconContainer,
        { borderColor: theme.colors.borderColor },
      ]}
    >
      {connectMutation.isConnecting && selectedAuth === auth ? (
        <ThemedSpinner color={theme.colors.primaryText} />
      ) : (
        <TouchableOpacity
          key={strategy}
          onPress={connectInAppWallet}
          disabled={connectMutation.isConnecting}
        >
          <RNImage size={38} data={socialIcons[auth]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function PreOtpLogin(
  props: InAppWalletFormUIProps & {
    auth: PreAuthArgsType["strategy"];
  },
) {
  const { theme, auth, client, setScreen, wallet } = props;
  const [sendingOtp, setSendingOtp] = useState(false);
  const [phoneOrEmail, setPhoneNumberOrEmail] = useState("");

  const sentOtpCode = async () => {
    if (!phoneOrEmail) return;
    setSendingOtp(true);
    if (auth === "phone") {
      await preAuthenticate({
        client,
        strategy: auth,
        phoneNumber: phoneOrEmail,
      });
      setSendingOtp(false);
      setScreen({
        screen: "otp",
        auth: {
          strategy: auth,
          phoneNumber: phoneOrEmail,
        },
        wallet,
      });
    } else {
      await preAuthenticate({
        client,
        strategy: auth,
        email: phoneOrEmail,
      });
      setSendingOtp(false);
      setScreen({
        screen: "otp",
        auth: { strategy: auth, email: phoneOrEmail },
        wallet,
      });
    }
  };

  return (
    <ThemedInputWithSubmit
      theme={theme}
      placeholder={auth === "phone" ? "Phone number" : "Email address"}
      onChangeText={setPhoneNumberOrEmail}
      value={phoneOrEmail}
      keyboardType={auth === "phone" ? "phone-pad" : "email-address"}
      onSubmit={sentOtpCode}
      isSubmitting={sendingOtp}
    />
  );
}

export function OtpLogin(
  props: InAppWalletFormUIProps & {
    auth: MultiStepAuthProviderType;
  },
) {
  const { theme, auth, wallet, client, connectMutation } = props;
  const [verificationCode, setVerificationCode] = useState("");

  const connectInAppWallet = async () => {
    if (!verificationCode || !verificationCode) return;
    await connectMutation.connect(async () => {
      if (auth.strategy === "phone") {
        await wallet.connect({
          client,
          strategy: auth.strategy,
          phoneNumber: auth.phoneNumber,
          verificationCode,
        });
      } else {
        await wallet.connect({
          client,
          strategy: auth.strategy,
          email: auth.email,
          verificationCode,
        });
      }
      await setLastAuthProvider(auth.strategy, nativeLocalStorage);
      return wallet;
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
      <ThemedButton
        theme={theme}
        onPress={connectInAppWallet}
        variant="accent"
        disabled={connectMutation.isConnecting}
      >
        {connectMutation.isConnecting ? (
          <ThemedSpinner color={theme.colors.accentButtonText} />
        ) : (
          <ThemedText
            theme={theme}
            type="defaultSemiBold"
            style={{ color: theme.colors.accentButtonText }}
          >
            Verify
          </ThemedText>
        )}
      </ThemedButton>
      {connectMutation.error && (
        <ThemedText
          theme={theme}
          type="subtext"
          style={{ color: theme.colors.danger }}
        >
          {connectMutation.error.message}
        </ThemedText>
      )}
    </>
  );
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
