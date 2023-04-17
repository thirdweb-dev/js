// implemnet a drag and drop component using hooks

import { useState, useRef } from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import { Theme, fontSize, iconSize, radius, spacing } from "../design-system";
import styled from "@emotion/styled";
import { Spacer } from "./Spacer";
import { isMobile } from "../evm/utils/isMobile";
import { IconFC } from "../wallet/ConnectWallet/icons/types";

export const DragNDrop: React.FC<{
  extension: string;
  accept: string;
  onUpload: (file: File) => void;
}> = (props) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);
  const dragCounter = useRef(0);
  const [uploaded, setUploaded] = useState<File | undefined>();

  const dragIn: React.DragEventHandler<HTMLDivElement> = (e) => {
    setError(false);
    setUploaded(undefined);
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const dragOut: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current > 0) {
      return;
    }
    setDragging(false);
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
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      dragCounter.current = 0;
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
            outline: "1px solid red",
            opacity: 0,
            display: "none",
          }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <DropContainer data-is-dragging={dragging} data-error={error}>
          {!uploaded ? (
            <>
              {" "}
              <UploadIconStyled width={iconSize.xl} height={iconSize.xl} />
              <Spacer y="md" />
              <Message>{message}</Message>
              <Spacer y="md" />
              {error ? (
                <ErrorMessage>
                  {" "}
                  Please upload a {props.extension} file{" "}
                </ErrorMessage>
              ) : (
                <Extension> {props.extension} </Extension>
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

const UploadIconStyled = styled(UploadIcon)<{ theme?: Theme }>`
  color: ${(props) => props.theme.text.secondary};
`;

const DropContainer = styled.div<{ theme?: Theme }>`
  border: 2px solid ${(p) => p.theme.bg.elevated};
  border-radius: ${radius.md};
  padding: ${spacing.xl} ${spacing.md};
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    border-color: ${(p) => p.theme.link.primary};
  }

  &[data-is-dragging="true"] {
    color: ${(p) => p.theme.link.primary};
  }

  &[data-error="true"] {
    border-color: ${(p) => p.theme.input.errorRing};
  }
`;

const ErrorMessage = styled.p<{ theme?: Theme }>`
  color: ${(p) => p.theme.input.errorRing};
  font-size: ${fontSize.sm};
  margin: 0;
`;

const Extension = styled.span<{ theme?: Theme }>`
  color: ${(p) => p.theme.text.secondary};
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
  color: ${(p) => p.theme.text.neutral};
  font-size: ${fontSize.md};
  margin: 0;
  font-weight: 600;
`;
