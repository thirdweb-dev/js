import { useEffect, useState } from "react";
import type { ComponentWithChildren } from "@/types/component-with-children";

interface DelayedDisplayProps {
  delay: number;
}

function useDelayedDisplay(delay: number) {
  const [displayContent, setDisplayContent] = useState(false);

  // FIXME: this is a weird thing, we should not need it - in the meantime this is a legit use case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayContent(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return displayContent;
}

export const DelayedDisplay: ComponentWithChildren<DelayedDisplayProps> = ({
  delay,
  children,
}) => {
  const displayContent = useDelayedDisplay(delay);

  if (!displayContent) {
    return null;
  }

  return <>{children}</>;
};
