import { useTrack } from "hooks/analytics/useTrack";
import { ZapIcon } from "lucide-react";
import {
  type ButtonProps,
  LinkButton,
  type LinkButtonProps,
} from "tw-components";

interface GeneralCtaProps extends Omit<LinkButtonProps, "href"> {
  title: string;
  href: string;
  size?: ButtonProps["size"];
}

export const ProductButton: React.FC<GeneralCtaProps> = ({
  title,
  href,
  ...props
}) => {
  const trackEvent = useTrack();

  return (
    <LinkButton
      leftIcon={<ZapIcon className="size-4 fill-black" />}
      w="full"
      py="24px"
      onClick={() =>
        trackEvent({
          category: "cta-button",
          action: "click",
          label: "start",
          title,
        })
      }
      fontSize="20px"
      fontWeight="bold"
      textAlign="center"
      borderRadius="md"
      href={href}
      isExternal={href.startsWith("http")}
      _hover={{ opacity: 0.8 }}
      noIcon
      {...props}
    >
      {title}
    </LinkButton>
  );
};
