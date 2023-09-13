import { Spacer } from "../../../components/Spacer";
import { InputSelectionUI } from "../InputSelectionUI";
import { Container, ModalHeader } from "../../../components/basic";
import { Theme, iconSize, spacing } from "../../../design-system";
import styled from "@emotion/styled";
import { Button } from "../../../components/buttons";
import { GoogleIcon } from "../../ConnectWallet/icons/GoogleIcon";
import { PaperLoginType } from "./types";

export const PaperFormUI = (props: {
  onSelect: (loginType: PaperLoginType) => void;
  showOrSeparator?: boolean;
  googleLoginSupported: boolean;
}) => {
  return (
    <div>
      {props.googleLoginSupported && (
        <>
          <SocialButton
            variant="secondary"
            fullWidth
            onClick={() => {
              props.onSelect({ google: true });
            }}
          >
            <GoogleIcon size={iconSize.md} />
            Sign in with Google
          </SocialButton>

          <Spacer y="lg" />
        </>
      )}

      <InputSelectionUI
        onSelect={(email) => props.onSelect({ email })}
        placeholder="Enter your email address"
        name="email"
        type="email"
        errorMessage={(_input) => {
          const input = _input.replace(/\+/g, "");
          const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
          const isValidEmail = emailRegex.test(input);
          if (!isValidEmail) {
            return "Invalid email address";
          }
        }}
        emptyErrorMessage="email address is required"
        showOrSeparator={props.showOrSeparator}
      />
    </div>
  );
};

export const PaperFormUIScreen: React.FC<{
  onSelect: (loginType: PaperLoginType) => void;
  onBack: () => void;
  modalSize: "compact" | "wide";
  googleLoginSupported: boolean;
}> = (props) => {
  const isCompact = props.modalSize === "compact";
  return (
    <Container
      fullHeight
      flex="column"
      p="lg"
      animate="fadein"
      style={{
        minHeight: "250px",
      }}
    >
      <ModalHeader onBack={props.onBack} title="Sign in" />
      {isCompact ? <Spacer y="xl" /> : null}

      <Container
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <PaperFormUI
          googleLoginSupported={props.googleLoginSupported}
          onSelect={props.onSelect}
          showOrSeparator={false}
        />
      </Container>
    </Container>
  );
};

const SocialButton = /* @__PURE__ */ styled(Button)<{ theme?: Theme }>`
  display: flex;
  justify-content: center;
  gap: ${spacing.sm};
`;
