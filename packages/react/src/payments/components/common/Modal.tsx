// UNCHANGED
import { css, cx } from "@emotion/css";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import { opacity0, opacity1 } from "../../lib/utils/styles";

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  escapeToClose?: boolean;
  clickOutsideModalToClose?: boolean;
  bgColor?: string;
  isFullScreen?: boolean;
  hasCloseButton?: boolean;
  children: React.ReactNode;
}> = ({
  isOpen,
  onClose,
  escapeToClose = true,
  clickOutsideModalToClose = false,
  bgColor = "#FAFAFA",
  isFullScreen,
  hasCloseButton = true,
  children,
}) => {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (escapeToClose) {
      document.addEventListener("keydown", keyDownHandler);
    }

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const additionalDialogClasses = isFullScreen ? "" : dialogContainedClasses;
  const dialogPanelBg = isFullScreen ? "transparent" : bgColor;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={cx(
          "paper-modal",
          css`
            position: relative;
            z-index: 1000;
          `,
        )}
        onClose={clickOutsideModalToClose ? onClose : () => {}}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter={enterClasses}
          enterFrom={opacity0}
          enterTo={opacity1}
          leave={leaveClasses}
          leaveFrom={opacity1}
          leaveTo={opacity0}
        >
          <div
            className={cx(
              "paper-modal-overlay",
              css`
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.5);
              `,
            )}
          />
        </Transition.Child>

        <div
          className={css`
            overflow-y: auto;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          `}
        >
          <div
            className={css`
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100%;
            `}
          >
            <Transition.Child
              as={Fragment}
              enter={enterClasses}
              enterFrom={cx(opacity0, scale95)}
              enterTo={cx(opacity1, scale100)}
              leave={leaveClasses}
              leaveFrom={cx(opacity1, scale100)}
              leaveTo={cx(opacity0, scale95)}
            >
              <Dialog.Panel
                className={cx(
                  "paper-modal-content",
                  dialogClasses,
                  additionalDialogClasses,
                )}
                style={{ backgroundColor: dialogPanelBg }}
              >
                {hasCloseButton && <CloseButton onClose={onClose} />}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <button
      aria-label="close modal"
      className={css`
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.5rem;
        border-radius: 9999px;
        cursor: pointer;
        &:hover {
          background-color: rgba(160, 174, 192, 0.1);
        }

        &:active {
          background-color: rgba(160, 174, 192, 0.2);
        }
      `}
    >
      <svg
        className={css`
          width: 1.25rem;
          height: 1.25rem;
        `}
        onClick={onClose}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  );
};

const enterClasses = css`
  transition-duration: 300ms;
  transition-timing-function: ease-out;
`;

const leaveClasses = css`
  transition-duration: 200ms;
  transition-timing-function: ease-in;
`;

const scale95 = css`
  transform: scale(0.95);
`;

const scale100 = css`
  transform: scale(1);
`;

const dialogClasses = css`
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  transition-property: all;
  text-align: left;
  vertical-align: middle;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const dialogContainedClasses = css`
  padding: 1.25rem;

  @media (min-width: 640px) {
    margin: 1rem;
  }
`;
