import {
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { BackButton, ModalTitle } from "../../../../components/modalElements";
import { iconSize, spacing } from "../../../../design-system";
import {
  ErrorMessage,
  FormFooter,
  Input,
} from "../../../../components/formElements";
import { Button } from "../../../../components/buttons";
import { MagicLink } from "@thirdweb-dev/wallets";
import { useState } from "react";
import { Spinner } from "../../../../components/Spinner";

export const EmailConnect: React.FC<{
  onBack: () => void;
  onConnect: () => void;
}> = (props) => {
  const magicLinkObj = useSupportedWallet("magicLink");
  const [isConnecting, setIsConnecting] = useState(false);
  const createInstance = useCreateWalletInstance();
  const twContext = useThirdwebWallet();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleSmsConnect = async () => {
    const magicWallet = createInstance(magicLinkObj) as MagicLink;
    setIsConnecting(true);
    await magicWallet.connect({
      email,
    });
    setIsConnecting(false);
    twContext?.handleWalletConnect(magicWallet);
    props.onConnect();
  };

  const error = email && !isValidEmail;

  return (
    <>
      <BackButton onClick={props.onBack}></BackButton>
      <Spacer y="md" />
      <Img
        src={magicLinkObj.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
      />
      <Spacer y="md" />
      <ModalTitle> Login with Email </ModalTitle>

      <Spacer y="lg" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSmsConnect();
        }}
      >
        {/* Phone number */}
        <Input
          type="email"
          id="email"
          name="email"
          variant="outline"
          placeholder="johndoe@gmail.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // check if a valid phone number using browser api
            setIsValidEmail(e.target.validity.valid);
          }}
          data-error={error}
        />

        {error && (
          <>
            <Spacer y="sm" />
            <ErrorMessage>Invalid Email </ErrorMessage>
          </>
        )}

        <Spacer y="xl" />

        <FormFooter>
          <Button
            variant="inverted"
            style={{
              gap: spacing.sm,
            }}
          >
            {isConnecting ? "Signing in" : "Sign in"}
            {isConnecting && <Spinner color="inverted" size="sm" />}
          </Button>
        </FormFooter>
      </form>
    </>
  );
};
