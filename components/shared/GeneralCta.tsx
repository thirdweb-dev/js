import { Box, Icon } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { BsLightningCharge } from "react-icons/bs";
import { ButtonProps, LinkButton } from "tw-components";

interface GeneralCtaProps extends ButtonProps {
  size?: ButtonProps["size"];
  title?: string;
}

export const GeneralCta: React.FC<GeneralCtaProps> = ({
  size = "md",
  title = "Start building",
  ...props
}) => {
  const { trackEvent } = useTrack();

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
      px={20}
      py={{ base: 6, md: 8 }}
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
      href="/dashboard"
      {...props}
    >
      <Box as="span" py={0.5}>
        {title}
      </Box>
    </LinkButton>
  );
};
