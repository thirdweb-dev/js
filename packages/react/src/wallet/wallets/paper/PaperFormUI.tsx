import { Spacer } from "../../../components/Spacer";
import { InputSelectionUI } from "../InputSelectionUI";
import { ScreenContainer } from "../../../components/basic";
import { BackButton, ModalTitle } from "../../../components/modalElements";

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
}> = (props) => {
  return (
    <ScreenContainer>
      <BackButton onClick={props.onBack} />
      <Spacer y="lg" />
      <ModalTitle>Sign in</ModalTitle>
      <Spacer y="lg" />
      <PaperFormUI
        onSelect={(email) => props.onEmail(email)}
        showOrSeparator={false}
        submitType="button"
      />
    </ScreenContainer>
  );
};

// const SocialButton = /* @__PURE__ */ styled(Button)<{ theme?: Theme }>`
//   display: flex;
//   justify-content: center;
//   gap: ${spacing.sm};
// `;
