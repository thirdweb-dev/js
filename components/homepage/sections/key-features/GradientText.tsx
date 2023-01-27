import { Box } from "@chakra-ui/react";
import { TrackedLink, TrackedLinkProps } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface GradientTextProps extends Omit<TrackedLinkProps, "href"> {
  stopOne: string;
  stopTwo: string;
  href?: string;
}

export const GradientText: ComponentWithChildren<GradientTextProps> = ({
  children,
  stopOne,
  stopTwo,
  href,
  ...restProps
}) => {
  const props = {
    bgGradient: `linear-gradient(70deg, ${stopOne}, ${stopTwo} , ${stopOne})`,
    bgClip: "text",
    bgSize: "200%",
  };

  return href ? (
    <TrackedLink
      {...restProps}
      href={href}
      transition="background 0.5s ease"
      _hover={{ bgPos: "100%" }}
      {...props}
    >
      {children}
    </TrackedLink>
  ) : (
    <Box as="span" {...props}>
      {children}
    </Box>
  );
};
