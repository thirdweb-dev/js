import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import type { ThirdwebClient } from "../../../../client/client.js";
import { preAuthenticate } from "../../../../wallets/in-app/core/authentication/index.js";
import type {
  MultiStepAuthProviderType,
  PreAuthArgsType,
} from "../../../../wallets/in-app/core/authentication/type.js";
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
import type { ModalState } from "./ConnectButton.js";

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
  setScreen: (screen: ModalState) => void;
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
      <PreOtpLogin auth="phone" {...props} />
      <PreOtpLogin auth="email" {...props} />
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
  const { theme, auth, wallet, client } = props;
  const [verificationCode, setVerificationCode] = useState("");
  const { connect, isConnecting } = useConnect();

  const connectInAppWallet = async () => {
    if (!verificationCode || !verificationCode) return;
    await connect(async () => {
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
      return wallet;
    });
  };

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
