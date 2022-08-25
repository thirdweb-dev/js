import { Box, Icon } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { BsLightningCharge } from "react-icons/bs";
import { ButtonProps, LinkButton, LinkButtonProps } from "tw-components";

interface GeneralCtaProps extends Omit<LinkButtonProps, "href"> {
  size?: ButtonProps["size"];
  title?: string;
  href?: string;
}

export const GeneralCta: React.FC<GeneralCtaProps> = ({
  size = "md",
  title = "Start building",
  href = "/dashboard",
  ...props
}) => {
  const trackEvent = useTrack();

  return (
    <LinkButton
      role="group"
      leftIcon={
        <Icon
          as={BsLightningCharge}
          color="#1D64EF"
          _groupHover={{ color: "#E0507A" }}
        />
      }
      color="black"
      px={size === "lg" ? 20 : 8}
      py={size === "lg" ? { base: 6, md: 8 } : { base: 4, md: 6 }}
      onClick={() =>
        trackEvent({
          category: "cta-button",
          action: "click",
          label: "start",
          title,
        })
      }
      textAlign="center"
      variant="gradient"
      fromcolor="#1D64EF"
      tocolor="#E0507A"
      size={size}
      borderRadius="md"
      href={href}
      {...props}
    >
      <Box as="span" py={0.5}>
        {title}
      </Box>
    </LinkButton>
  );
};
