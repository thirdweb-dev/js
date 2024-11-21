import { useTrack } from "hooks/analytics/useTrack";
import { ZapIcon } from "lucide-react";
import {
  type ButtonProps,
  LinkButton,
  type LinkButtonProps,
} from "tw-components";

interface GeneralCtaProps extends Omit<LinkButtonProps, "href"> {
  size?: ButtonProps["size"];
  title?: string;
  href?: string;
}

export const GeneralCta: React.FC<GeneralCtaProps> = ({
  size = "md",
  title = "Start building",
  href = "/team",
  ...props
}) => {
  const trackEvent = useTrack();

  return (
    <LinkButton
      role="group"
      leftIcon={
        <ZapIcon className="size-5 text-[#1D64EF] duration-150 ease-out group-hover:text-[#E0507A]" />
      }
      color="black"
      px={size === "lg" ? 20 : 8}
      py={size === "lg" ? { base: 5, md: 7 } : { base: 4, md: 6 }}
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
      <span className="py-0.5">{title}</span>
    </LinkButton>
  );
};
