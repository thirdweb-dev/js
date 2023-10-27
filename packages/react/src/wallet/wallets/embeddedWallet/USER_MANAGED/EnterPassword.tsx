import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Spacer } from "../../../../components/Spacer";
import { Container, Line, ModalHeader } from "../../../../components/basic";
import { Button, InputButton } from "../../../../components/buttons";
import { InputContainer, Input } from "../../../../components/formElements";
import { Text } from "../../../../components/text";
import { Spinner } from "../../../../components/Spinner";

export function EnterPasswordOrRecovery(props: {
  goBack: () => void;
  onVerify: (password: string) => void;
  email: string;
  modalSize: "wide" | "compact";
}) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader title="Enter Password" onBack={props.goBack} />
      </Container>

      <Line />
      <Spacer y="xxl" />

      <Container
        expand
        flex="column"
        center="y"
        p={props.modalSize === "wide" ? "xxl" : "lg"}
        style={{
          paddingTop: 0,
        }}
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(false);
            try {
              await props.onVerify(password);
            } catch (e) {
              setError(true);
              console.error(e);
            }
            setLoading(false);
          }}
        >
          <Text center>Enter the password for your account</Text>
          <Spacer y="sm" />
          <Text center color="primaryText">
            {props.email}
          </Text>

          <Spacer y="xl" />

          <InputContainer data-error={!!error}>
            <Input
              variant="transparent"
              required
              name={"new-password"}
              autoComplete="new-password"
              id="new-password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />

            <InputButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </InputButton>
          </InputContainer>

          {error && (
            <>
              <Spacer y="sm" />
              <Text color="danger" size="sm">
                Wrong password
              </Text>
            </>
          )}

          <Spacer y="md" />

          <Button fullWidth variant="accent" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="md" color="accentButtonText" />
              </>
            ) : (
              <>Verify</>
            )}
          </Button>
        </form>
      </Container>

      <Spacer y="sm" />
    </Container>
  );
}
