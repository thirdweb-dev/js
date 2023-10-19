import {
  EyeClosedIcon,
  EyeOpenIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";
import { Spacer } from "../../../../components/Spacer";
import { Container, ModalHeader, Line } from "../../../../components/basic";
import { Button, InputButton } from "../../../../components/buttons";
import { Input, InputContainer } from "../../../../components/formElements";
import { iconSize } from "../../../../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Text } from "../../../../components/text";
import { useState } from "react";
import { Spinner } from "../../../../components/Spinner";

export function CreatePassword(props: {
  goBack: () => void;
  email: string;
  onPassword: (password: string) => Promise<void>;
  modalSize: "wide" | "compact";
}) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader title="Create Password" onBack={props.goBack} />
      </Container>

      <Line />

      <Container
        expand
        px={props.modalSize === "wide" ? "xxl" : "lg"}
        flex="column"
        center="y"
        style={{
          paddingTop: 0,
        }}
      >
        {props.modalSize === "compact" && <Spacer y="xxl" />}
        <Container flex="row" center="x" color="accentText">
          <BounceContainer>
            <LockOpen1Icon width={iconSize.xxl} height={iconSize.xxl} />
          </BounceContainer>
        </Container>
        <Spacer y="xxl" />

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(false);
            setError(false);
            if (password) {
              try {
                setLoading(true);
                await props.onPassword(password);
              } catch (err: any) {
                setError(true);
                console.error(err);
              }
              setLoading(false);
            }
          }}
        >
          <Text center multiline>
            Set a password for your account
          </Text>
          <Spacer y="xs" />
          <Text center color="primaryText">
            {props.email}
          </Text>
          <Spacer y="xl" />

          <InputContainer>
            <Input
              variant="transparent"
              required
              name={"new-password"}
              autoComplete="new-password"
              id="new-password"
              onChange={(e) => setPassword(e.target.value)}
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

          <Spacer y="md" />

          <Button
            disabled={loading}
            variant="accent"
            fullWidth
            style={{
              minWidth: "100px",
            }}
            type="submit"
          >
            {loading ? (
              <Spinner size="md" color="accentButtonText" />
            ) : (
              "Set Password"
            )}
          </Button>

          {error && (
            <Container>
              <Spacer y="lg" />
              <Text size="sm" color="danger" center>
                Failed to set password
              </Text>
            </Container>
          )}
        </form>
      </Container>
      <Spacer y="xl" />
    </Container>
  );
}

const bounceAnimation = keyframes`
from {
  transform: translateY(-3px);
}
to {
  transform: translateY(3px);
}
`;

const BounceContainer = styled.div`
  animation: ${bounceAnimation} 1s ease-in-out infinite alternate;
`;
