import { useState } from "react";
import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFooter } from "../../../../components/formElements";
import {
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../../../../components/modalElements";
import { shortenAddress } from "../../../../evm/utils/addresses";
import { ExportDeviceWallet } from "./ExportDeviceWallet";
import { DeviceWalletModalHeader } from "./common";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Flex } from "../../../../components/basic";
import { iconSize } from "../../../../design-system";
import { green } from "@radix-ui/colors";

export const RemoveWallet: React.FC<{
  onRemove: () => void;
  address: string;
  onBack: () => void;
}> = (props) => {
  const [showExport, setShowExport] = useState(false);
  const [isExported, setIsExported] = useState(false);

  if (showExport) {
    return (
      <ExportDeviceWallet
        onBack={() => {
          setShowExport(false);
        }}
        onExport={() => {
          setIsExported(true);
          setShowExport(false);
        }}
      />
    );
  }

  return (
    <>
      <DeviceWalletModalHeader onBack={props.onBack} />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Remove Wallet {shortenAddress(props.address || "")}
      </ModalTitle>

      <Spacer y="md" />

      {isExported ? (
        <Flex gap="sm" alignItems="center">
          <CheckCircledIcon
            width={iconSize.md}
            height={iconSize.md}
            style={{
              flexShrink: 0,
            }}
            color={green.green8}
          />
          <ModalDescription>
            Wallet JSON file is downloaded to your device, You can now remove it
            safely.
          </ModalDescription>
        </Flex>
      ) : (
        <ModalDescription>
          Removing this saved wallet cannot be reverted. To ensure you have a
          backup{" "}
          <HelperLink
            as="button"
            onClick={() => {
              setShowExport(true);
            }}
            style={{
              display: "inline",
            }}
          >
            Export your wallet
          </HelperLink>
        </ModalDescription>
      )}

      <Spacer y="xl" />

      <FormFooter>
        <Button variant="danger" onClick={props.onRemove}>
          Remove
        </Button>
      </FormFooter>
    </>
  );
};
