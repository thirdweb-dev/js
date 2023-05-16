import {
  useCreateWalletInstance,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useState } from "react";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import {
  Input,
  ErrorMessage,
  FormFooter,
} from "../../../components/formElements";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
} from "../../../components/modalElements";
import { iconSize, spacing } from "../../../design-system";
import { ConfiguredMagicLinkWallet } from "./types";

export const SMSConnect: React.FC<{
  open: () => void;
  close: () => void;
  onBack: () => void;
  onConnect: () => void;
  magicLinkWalletConf: ConfiguredMagicLinkWallet;
}> = (props) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const createInstance = useCreateWalletInstance();
  const { setConnectedWallet, activeChain, setConnectionStatus } =
    useWalletContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const singleWallet = useWallets().length === 1;

  const handleSmsConnect = async () => {
    const magicWallet = createInstance(props.magicLinkWalletConf);
    setIsConnecting(true);
    props.close();
    const connectOptions = {
      chainId: activeChain?.chainId,
      phoneNumber,
    };
    try {
      setConnectionStatus("connecting");
      await magicWallet.connect(connectOptions);
      setIsConnecting(false);
      setConnectedWallet(magicWallet, connectOptions);
      props.onConnect();
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
      setConnectionStatus("disconnected");
      props.open();
    }
  };

  const error = phoneNumber && !isValidPhoneNumber;

  return (
    <>
      {!singleWallet && <BackButton onClick={props.onBack}></BackButton>}
      <Spacer y="md" />
      <Img
        src={props.magicLinkWalletConf.meta.iconURL}
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
