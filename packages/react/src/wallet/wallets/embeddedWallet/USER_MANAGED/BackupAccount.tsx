/* eslint-disable i18next/no-literal-string */

import { useState } from "react";
import { Spacer } from "../../../../components/Spacer";
import { Spinner } from "../../../../components/Spinner";
import { Container, ModalHeader, Line } from "../../../../components/basic";
import { Button, IconButton } from "../../../../components/buttons";
import { spacing, Theme, radius, iconSize } from "../../../../design-system";
import { Text } from "../../../../components/text";
import styled from "@emotion/styled";
import { useClipboard } from "../../../../evm/components/hooks/useCopyClipboard";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

// TODO (ews) - this is unused right now, no backup codes are generated
export function BackupAccount(props: {
  recoveryCodes: string[] | undefined;
  goBack: () => void;
  onNext: () => void;
  email: string;
  modalSize: "wide" | "compact";
}) {
  const [showCodes, setShowCodes] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyContent = `${props.email}\n\n${
    window.location.origin
  }\n\nRecovery Codes:\n\n${props.recoveryCodes?.join("\n") || ""}`;

  const { hasCopied, onCopy } = useClipboard(copyContent);

  if (showCodes) {
    return (
      <Container fullHeight flex="column" animate="fadein">
        <Container p="lg">
          <ModalHeader
            title="Copy Codes"
            onBack={() => {
              setShowCodes(false);
            }}
          />
        </Container>

        <Line />
        <Spacer y="lg" />

        <Container
          scrollY
          px="lg"
          style={
            props.modalSize === "compact"
              ? {
                  maxHeight: "280px",
                }
              : undefined
          }
        >
          {props.recoveryCodes ? (
            <Container flex="column" gap="sm" scrollY>
              {props.recoveryCodes.map((code, i) => {
                return <CopyRecoveryCode key={i} code={code} />;
              })}
              <Spacer y="md" />
            </Container>
          ) : (
            <Container flex="row" center="x">
              <Spinner size="xl" color="accentText" />
            </Container>
          )}
        </Container>

        <Line />

        <Container p="lg">
          <Button fullWidth variant="accent" onClick={onCopy} gap="xs">
            {hasCopied ? (
              <CheckIcon width={iconSize.sm} height={iconSize.sm} />
            ) : (
              <CopyIcon width={iconSize.sm} height={iconSize.sm} />
            )}

            {hasCopied ? "Copied" : "Copy All"}
          </Button>
        </Container>
      </Container>
    );
  }

  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader title="Backup account" onBack={props.goBack} />
      </Container>

      <Line />

      <Container p="lg">
        <Text multiline>
          Copy or download the recovery codes and keep them safe.
        </Text>
        <Text multiline>
          <Spacer y="md" />
          You will need it to recover access to your account if you forget your
          password. Each code can only be used once.
        </Text>
      </Container>

      <Container px="lg" flex="column" gap="sm" expand>
        {showCodes ? (
          <div>
            {props.recoveryCodes ? (
              <Container
                flex="column"
                gap="sm"
                scrollY
                style={{
                  maxHeight: "260px",
                }}
              >
                {props.recoveryCodes.map((code, i) => {
                  return <CopyRecoveryCode key={i} code={code} />;
                })}
              </Container>
            ) : (
              <Container flex="row" center="x">
                <Spinner size="xl" color="accentText" />
              </Container>
            )}
          </div>
        ) : (
          <Button
            variant="accent"
            gap="sm"
            onClick={() => {
              setShowCodes(true);
            }}
          >
            Copy Codes
          </Button>
        )}

        <Button
          fullWidth
          variant="accent"
          onClick={() => {
            downloadRecoveryCodes(
              copyContent,
              `recoveryCodes-${props.email}.txt`,
            );
          }}
        >
          Download
        </Button>
      </Container>

      <Spacer y="xl" />

      <Line />

      <Container p="lg" flex="column" gap="lg">
        <Container flex="row" gap="sm" center="y">
          <CheckboxButton
            aria-checked={copied}
            id="copy-checkbox"
            onClick={() => {
              setCopied(!copied);
            }}
          >
            <CheckIcon
              width={20}
              height={20}
              style={{
                opacity: copied ? 1 : 0,
                transform: copied ? "scale(1)" : "scale(0)",
                transition: "opacity 200ms ease, transform 200ms ease",
              }}
            />
          </CheckboxButton>

          <label
            htmlFor="copy-checkbox"
            style={{
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Text size="sm" color="primaryText">
              I have copied the codes
            </Text>
          </label>
        </Container>
        <Button
          fullWidth
          disabled={!copied}
          variant={copied ? "primary" : "outline"}
          style={{
            gap: spacing.xs,
          }}
          onClick={props.onNext}
        >
          Continue
        </Button>
      </Container>
    </Container>
  );
}

function CopyRecoveryCode(props: { code: string }) {
  return (
    <CopyContainer>
      <Text color="primaryText" size="sm">
        {props.code}
      </Text>
    </CopyContainer>
  );
}

const CopyContainer = styled.div<{ theme?: Theme }>`
  padding: ${spacing.md};
  border: 1px solid ${(p) => p.theme.colors.borderColor};
  border-radius: ${radius.md};
`;

const CheckboxButton = /* @__PURE__ */ styled(IconButton)<{ theme?: Theme }>`
  border: 2px solid ${(p) => p.theme.colors.accentText};
  color: ${(p) => p.theme.colors.accentText} !important;
  padding: 0;

  &[aria-checked="true"] {
    background: ${(p) => p.theme.colors.accentText};
    color: ${(p) => p.theme.colors.modalBg} !important;
  }
`;

function downloadRecoveryCodes(codes: string, fileName: string) {
  const blob = new Blob([codes], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  URL.revokeObjectURL(a.href);
}
