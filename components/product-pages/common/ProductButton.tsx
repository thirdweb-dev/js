import { Icon } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { ButtonProps, LinkButton, LinkButtonProps } from "tw-components";

interface GeneralCtaProps extends Omit<LinkButtonProps, "href"> {
  title: string;
  href: string;
  size?: ButtonProps["size"];
  iconColor?: string;
}

export const ProductButton: React.FC<GeneralCtaProps> = ({
  title,
  href,
  iconColor = "yellow.400",
  ...props
}) => {
  const trackEvent = useTrack();

  return (
    <LinkButton
      leftIcon={
        <Icon as={BsFillLightningChargeFill} color={iconColor} boxSize={4} />
      }
      w="full"
      py={"24px"}
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
