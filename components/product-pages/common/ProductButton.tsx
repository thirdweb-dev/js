import { Icon } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { ButtonProps, LinkButton, LinkButtonProps } from "tw-components";

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
      leftIcon={
        <Icon as={BsFillLightningChargeFill} color="yellow.400" boxSize={4} />
      }
      px={"64px"}
      py={"28px"}
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
      {...props}
    >
      {title}
    </LinkButton>
  );
};
