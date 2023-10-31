import { css, cx } from "@emotion/css";
import React from "react";
import { Spinner } from "./Spinner";

export const Button = ({
  isLoading = false,
  loadingText = "",
  ...props
}: {
  isLoading?: boolean;
  loadingText?: string;
} & React.HTMLProps<HTMLButtonElement>): React.ReactElement => {
  return (
    <button
      {...props}
      type={props.type as "button" | "submit" | "reset" | undefined}
      disabled={isLoading || props.disabled}
      className={cx(buttonClass, props.className)}
    >
      {isLoading ? (
        <div
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          `}
        >
          <Spinner
            className={
              loadingText
                ? css`
                    margin-right: 0.5rem;
                  `
                : ""
            }
          />
          {loadingText}
        </div>
      ) : (
        props.children
      )}
    </button>
  );
};

const buttonClass = css`
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  background-color: #1f2937;
  color: #ffffff;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  justify-content: flex-start;
  align-items: center;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
`;
