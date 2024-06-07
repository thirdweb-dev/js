import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import type { ThirdwebClient } from "../../../../client/client.js";
import { preAuthenticate } from "../../../../wallets/in-app/core/authentication/index.js";
import type { PreAuthArgsType } from "../../../../wallets/in-app/core/authentication/type.js";
import type {
  InAppWalletAuth,
  InAppWalletSocialAuth,
} from "../../../../wallets/in-app/core/wallet/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useConnect } from "../../../core/hooks/wallets/wallet-hooks.js";
import { radius, spacing } from "../../design-system/index.js";
import { ThemedInputWithSubmit } from "../components/input.js";
import { ThemedSpinner } from "../components/spinner.js";
import { APPLE_ICON, FACEBOOK_ICON, GOOGLE_ICON } from "../icons/svgs.js";

const defaultAuthOptions: InAppWalletAuth[] = [
  "email",
  "phone",
  "google",
  "facebook",
  "apple",
];

export const authOptionIcons = {
  google: GOOGLE_ICON,
  apple: APPLE_ICON,
  facebook: FACEBOOK_ICON,
};

type InAppWalletFormUIProps = {
  client: ThirdwebClient;
  theme: Theme;
  wallet: Wallet<"inApp">;
};

export function InAppWalletUI(props: InAppWalletFormUIProps) {
  const { wallet } = props;
  const config = wallet.getConfig();
  const authOptions = config?.auth?.options || defaultAuthOptions;
  const socialLogins = authOptions.filter(
    (x) => x === "google" || x === "apple" || x === "facebook",
  ) as InAppWalletSocialAuth[];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {socialLogins.map((auth) => (
          <SocialLogin key={auth} auth={auth} {...props} />
        ))}
      </View>
      <OtpLogin auth="phone" {...props} />
      <OtpLogin auth="email" {...props} />
    </View>
  );
}

function SocialLogin(
  props: InAppWalletFormUIProps & { auth: InAppWalletSocialAuth },
) {
  const { theme, wallet, auth, client } = props;
  const { connect, isConnecting } = useConnect();
  const strategy = props.auth;
  const connectInAppWallet = async () => {
    await connect(async () => {
      await wallet.connect({
        client,
        strategy: auth,
      });
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
      {isConnecting ? (
        <ThemedSpinner />
      ) : (
        <TouchableOpacity
          key={strategy}
          onPress={connectInAppWallet}
          disabled={isConnecting}
        >
          <SvgXml width={38} height={38} xml={authOptionIcons[auth]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function OtpLogin(
  props: InAppWalletFormUIProps & { auth: PreAuthArgsType["strategy"] },
) {
  const { theme, auth, wallet, client } = props;
  const [screen, setScreen] = useState<"phone" | "code">("phone");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [phoneOrEmail, setPhoneNumberOrEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const { connect, isConnecting } = useConnect();

  const sentOtpCode = async () => {
    if (!phoneOrEmail) return;
    setSendingOtp(true);
    if (auth === "phone") {
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
    setSendingOtp(false);
    setScreen("code");
  };

  const connectInAppWallet = async () => {
    if (!verificationCode || !phoneOrEmail) return;
    await connect(async () => {
      if (auth === "phone") {
        await wallet.connect({
          client,
          strategy: auth,
          phoneNumber: phoneOrEmail,
          verificationCode,
        });
      } else {
        await wallet.connect({
          client,
          strategy: auth,
          email: phoneOrEmail,
          verificationCode,
        });
      }
      return wallet;
    });
  };

  if (screen === "phone") {
    return (
      <ThemedInputWithSubmit
        theme={theme}
        placeholder={auth === "phone" ? "Enter phone number" : "Enter email"}
        onChangeText={setPhoneNumberOrEmail}
        value={phoneOrEmail}
        keyboardType={auth === "phone" ? "phone-pad" : "email-address"}
        onSubmit={sentOtpCode}
        isSubmitting={sendingOtp}
      />
    );
  }

  return (
    <>
      <ThemedInputWithSubmit
        theme={theme}
        placeholder="Enter verification code"
        onChangeText={setVerificationCode}
        value={verificationCode}
        keyboardType="numeric"
        onSubmit={connectInAppWallet}
        isSubmitting={isConnecting}
      />
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
