import {
  useCreateWalletInstance,
  useSupportedWallet,
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
import { MagicLink } from "@thirdweb-dev/wallets";
import { useState } from "react";
import { Spinner } from "../../../../components/Spinner";

export const SMSConnect: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  showModal: () => void;
  hideModal: () => void;
}> = (props) => {
  const magicLinkObj = useSupportedWallet("magicLink");
  const [isConnecting, setIsConnecting] = useState(false);
  const createInstance = useCreateWalletInstance();
  const twContext = useThirdwebWallet();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const handleSmsConnect = async () => {
    const magicWallet = createInstance(magicLinkObj) as MagicLink;
    setIsConnecting(true);
    props.hideModal();
    const connectOptions = {
      chainId: twContext?.activeChain?.chainId,
      phoneNumber,
    };
    await magicWallet.connect(connectOptions);
    setIsConnecting(false);
    props.showModal();
    twContext?.handleWalletConnect(magicWallet, connectOptions);
    props.onConnect();
  };

  const error = phoneNumber && !isValidPhoneNumber;

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
