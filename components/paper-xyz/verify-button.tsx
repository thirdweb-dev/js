import { useEffect, useRef } from "react";
import { Button, ButtonProps } from "tw-components";

interface PaperKYBButtonProps extends Omit<ButtonProps, "onClick"> {
  onSuccess: (paperJTW: string) => void;
}

export const PaperKYBButton: React.FC<PaperKYBButtonProps> = ({
  onSuccess,
  ...restButtonProps
}) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin === "https://paper.xyz") {
        if (event.data.eventType === "sellerOnboardingEmailVerified") {
          onSuccess(event.data.authToken);
          try {
            if (windowRef.current) {
              windowRef.current.close();
            }
          } catch (err) {
            console.error("failed to close window", err);
          }
        }
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [onSuccess]);

  return (
    <>
      <Button
        {...restButtonProps}
        onClick={() => {
          windowRef.current = window.open(
            `https://paper.xyz/sdk/2022-08-12/seller-onboarding/verify-email?platformId=0xE668ec126bE007602F520E9dFcF9aefA870E3148`,
            "_blank",
          );
        }}
      >
        KYB with paper.xyz
      </Button>
    </>
  );
};
