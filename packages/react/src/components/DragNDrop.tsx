import { useState } from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import { Theme, fontSize, iconSize, radius, spacing } from "../design-system";
import styled from "@emotion/styled";
import { Spacer } from "./Spacer";
import { isMobile } from "../evm/utils/isMobile";
import type { IconFC } from "../wallet/ConnectWallet/icons/types";

export const DragNDrop: React.FC<{
  extension: string;
  accept: string;
  onUpload: (file: File) => void;
}> = (props) => {
  const [error, setError] = useState(false);
  const [uploaded, setUploaded] = useState<File | undefined>();
  const [isDragging, setIsDragging] = useState(false);

  const dragIn: React.DragEventHandler<HTMLDivElement> = (e) => {
    setError(false);
    setUploaded(undefined);
    setIsDragging(true);

    e.preventDefault();
    e.stopPropagation();
  };

  const dragOut: React.DragEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(false);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== props.accept) {
      setError(true);
    } else {
      setUploaded(file);
      props.onUpload(file);
    }
  };

  const drop: React.DragEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(false);
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const message = isMobile()
    ? "Click to Upload"
    : "Drop your file here or click to upload";

  return (
    <div
      onDragEnter={dragIn}
      onDragLeave={dragOut}
      onDragOver={(e) => {
        setIsDragging(true);
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={() => {
        setError(false);
      }}
      onDrop={drop}
      style={{
        cursor: "pointer",
      }}
    >
      <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          accept={props.accept}
          multiple={false}
          style={{
            display: "none",
          }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <DropContainer data-error={error} data-is-dragging={isDragging}>
          {!uploaded ? (
            <>
              {" "}
              <UploadIconSecondary width={iconSize.lg} height={iconSize.lg} />
              <Spacer y="md" />
              <Message
                style={{
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                {" "}
                {message}
              </Message>
              <Spacer y="md" />
              {error ? (
                <ErrorMessage>
                  {" "}
                  Please upload a {props.extension} file{" "}
                </ErrorMessage>
              ) : (
                <ExtensionText> {props.extension} </ExtensionText>
              )}
            </>
          ) : (
            <>
              <Message>{uploaded.name} uploaded successfully</Message>
              <Spacer y="md" />
              <CheckCircleIcon size={iconSize.xl} />
            </>
          )}
        </DropContainer>
      </label>
    </div>
  );
};

const UploadIconSecondary = /* @__PURE__ */ styled(UploadIcon)<{
  theme?: Theme;
}>`
  color: ${(props) => props.theme.colors.secondaryText};
  transition:
    transform 200ms ease,
    color 200ms ease;
`;

const DropContainer = styled.div<{ theme?: Theme }>`
  border: 2px solid ${(p) => p.theme.colors.borderColor};
  border-radius: ${radius.md};
  padding: ${spacing.xl} ${spacing.md};
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: border-color 200ms ease;

  &:hover,
  &[data-is-dragging="true"] {
    border-color: ${(p) => p.theme.colors.accentText};
    svg {
      color: ${(p) => p.theme.colors.accentText};
    }
  }

  &[data-error="true"] {
    border-color: ${(p) => p.theme.colors.danger};
  }
`;

const ErrorMessage = styled.p<{ theme?: Theme }>`
  color: ${(p) => p.theme.colors.danger};
  font-size: ${fontSize.sm};
  margin: 0;
`;

const ExtensionText = styled.span<{ theme?: Theme }>`
  color: ${(p) => p.theme.colors.secondaryText};
  font-size: ${fontSize.sm};
`;

const CheckCircleIcon: IconFC = (props) => (
  <svg
    width={props.size}
    height={props.size}
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M35.6666 17.4671V19.0004C35.6645 22.5945 34.5008 26.0916 32.3488 28.9701C30.1969 31.8487 27.1721 33.9546 23.7255 34.9736C20.279 35.9926 16.5954 35.8703 13.224 34.6247C9.85272 33.3792 6.97434 31.0773 5.01819 28.0622C3.06203 25.0472 2.1329 21.4805 2.36938 17.8943C2.60586 14.308 3.99526 10.8943 6.33039 8.16221C8.66551 5.43012 11.8212 3.52606 15.3269 2.734C18.8326 1.94194 22.5004 2.30432 25.7833 3.76709"
      stroke="#5BD58C"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35.6667 5.66699L19 22.3503L14 17.3503"
      stroke="#5BD58C"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Message = styled.p<{ theme?: Theme }>`
  color: ${(p) => p.theme.colors.primaryText};
  font-size: ${fontSize.md};
  margin: 0;
  font-weight: 600;
`;
