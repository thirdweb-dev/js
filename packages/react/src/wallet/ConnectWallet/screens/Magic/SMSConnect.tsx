import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { iconSize, spacing } from "../../../../design-system";
import {
  ErrorMessage,
  FormFooter,
  Input,
} from "../../../../components/formElements";
import { Button } from "../../../../components/buttons";
import { useState } from "react";
import { Spinner } from "../../../../components/Spinner";
import { MagicLinkWallet } from "../../../wallets/magicLink";

export const SMSConnect: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  magicLinkWallet: MagicLinkWallet;
}> = (props) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const createInstance = useCreateWalletInstance();
  const twContext = useThirdwebWallet();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const handleSmsConnect = async () => {
    const magicWallet = createInstance(props.magicLinkWallet);
    setIsConnecting(true);
    const connectOptions = {
      chainId: twContext.activeChain?.chainId,
      phoneNumber,
    };
    await magicWallet.connect(connectOptions);
    setIsConnecting(false);
    twContext.handleWalletConnect(magicWallet, connectOptions);
    props.onConnect();
  };

  const error = phoneNumber && !isValidPhoneNumber;

  return (
    <>
      <BackButton onClick={props.onBack}></BackButton>
      <Spacer y="md" />
      <Img
        src={props.magicLinkWallet.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
      />
      <Spacer y="md" />
      <ModalTitle> Login with phone number </ModalTitle>
      <Spacer y="sm" />
      <ModalDescription>
        Enter your phone number including country code
      </ModalDescription>

      <Spacer y="lg" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSmsConnect();
        }}
      >
        {/* Phone number */}
        <Input
          type="tel"
          id="phone"
          name="phone"
          variant="outline"
          placeholder="+1234567890"
          required
          value={phoneNumber}
          pattern="\+[0-9]{1}[0-9]+"
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            // check if a valid phone number using browser api
            setIsValidPhoneNumber(e.target.validity.valid);
          }}
          data-error={error}
        />

        <div
          style={{
            visibility: error ? "visible" : "hidden",
          }}
        >
          <Spacer y="sm" />
          <ErrorMessage>
            {!phoneNumber.startsWith("+")
              ? "Phone number must start with +"
              : "Invalid phone number"}
          </ErrorMessage>
        </div>

        <Spacer y="lg" />

        <FormFooter>
          <Button
            variant="inverted"
            style={{
              gap: spacing.sm,
            }}
          >
            {isConnecting ? "Connecting" : "Connect"}
            {isConnecting && <Spinner color="inverted" size="sm" />}
          </Button>
        </FormFooter>
      </form>
    </>
  );
};
