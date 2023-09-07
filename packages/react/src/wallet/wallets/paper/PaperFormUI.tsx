import { Spacer } from "../../../components/Spacer";
import { InputSelectionUI } from "../InputSelectionUI";
import { ModalHeader, ScreenContainer } from "../../../components/basic";
import { spacing } from "../../../design-system";
import { FloatingPlane } from "./FloatingPlane";

export const PaperFormUI = (props: {
  onSelect: (input: string | undefined) => void;
  showOrSeparator?: boolean;
  submitType: "inline" | "button";
}) => {
  return (
    <div>
      {/* <SocialButton
        variant="secondary"
        fullWidth
        onClick={() => {
          props.onSelect(undefined);
        }}
      >
        <GoogleIcon size={iconSize.md} />
        Sign in with Google
      </SocialButton>

      <Spacer y="lg" />

      <TextDivider>
        <span> OR </span>
      </TextDivider> */}

      {/* <Spacer y="lg" /> */}

      <InputSelectionUI
        submitType={props.submitType}
        onSelect={props.onSelect}
        placeholder="Sign in with email address"
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
  onEmail: (email: string | undefined) => void;
  onBack: () => void;
  modalSize: "compact" | "wide";
}> = (props) => {
  return (
    <ScreenContainer
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ModalHeader onBack={props.onBack} title="Sign in" />

      <Spacer y="xl" />

      <div
        style={
          props.modalSize === "wide"
            ? {
                padding: spacing.lg,
              }
            : undefined
        }
      >
        <div>
          <FloatingPlane size={120} />
          <Spacer y="xl" />
          <PaperFormUI
            onSelect={(email) => props.onEmail(email)}
            showOrSeparator={false}
            submitType="button"
          />
        </div>
      </div>
    </ScreenContainer>
  );
};

// const SocialButton = /* @__PURE__ */ styled(Button)<{ theme?: Theme }>`
//   display: flex;
//   justify-content: center;
//   gap: ${spacing.sm};
// `;
