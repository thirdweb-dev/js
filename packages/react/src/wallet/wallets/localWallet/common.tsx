import { BackButton, ModalTitle } from "../../../components/modalElements";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { Flex } from "../../../components/basic";
import { Spacer } from "../../../components/Spacer";

export const LocalWalletModalHeader: React.FC<{
  onBack: () => void;
  meta: WalletConfig["meta"];
  hideBack?: boolean;
  title: string;
}> = (props) => {
  return (
    <>
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{
          position: "relative",
        }}
      >
        {!props.hideBack && (
          <BackButton
            onClick={props.onBack}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        )}
        <ModalTitle> {props.title}</ModalTitle>
      </Flex>
      <Spacer y={"lg"} />
    </>
  );
};
