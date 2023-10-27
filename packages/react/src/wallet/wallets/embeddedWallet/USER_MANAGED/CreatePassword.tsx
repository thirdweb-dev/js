import {
  EyeClosedIcon,
  EyeOpenIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";
import { Spacer } from "../../../../components/Spacer";
import { Container, ModalHeader, Line } from "../../../../components/basic";
import {
  Button,
  IconButton,
  InputButton,
} from "../../../../components/buttons";
import { Input, InputContainer } from "../../../../components/formElements";
import { Theme, iconSize } from "../../../../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Text } from "../../../../components/text";
import { useState } from "react";
import { Spinner } from "../../../../components/Spinner";
import { CheckIcon } from "@radix-ui/react-icons";

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
  const [saved, setSaved] = useState(false);

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
        <Spacer y="xl" />

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
            Set a password for your account. You will need this password when
            connecting from a new device.
          </Text>
          <Spacer y="xs" />
          <Text center color="primaryText">
            Make sure to save it.
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

          <Spacer y="lg" />

          <Container flex="row" gap="sm" center="y">
            <CheckboxButton
              aria-checked={saved}
              type="button"
              id="save-checkbox"
              onClick={() => {
                setSaved(!saved);
              }}
            >
              <CheckIcon
                width={20}
                height={20}
                style={{
                  opacity: saved ? 1 : 0,
                  transform: saved ? "scale(1)" : "scale(0)",
                  transition: "opacity 200ms ease, transform 200ms ease",
                }}
              />
            </CheckboxButton>

            <label
              htmlFor="save-checkbox"
              style={{
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <Text size="sm" color="primaryText">
                I have saved my password
              </Text>
            </label>
          </Container>

          <Spacer y="md" />

          <Button
            disabled={loading || !saved}
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

const CheckboxButton = /* @__PURE__ */ styled(IconButton)<{ theme?: Theme }>`
  border: 2px solid ${(p) => p.theme.colors.accentText};
  color: ${(p) => p.theme.colors.accentText} !important;
  padding: 0;

  &[aria-checked="true"] {
    background: ${(p) => p.theme.colors.accentText};
    color: ${(p) => p.theme.colors.modalBg} !important;
  }
`;

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
