"use client";

import { type ReactNode, useEffect, useState } from "react";
import type { ComponentWithChildren } from "types/component-with-children";
import styles from "./ClientOnly.module.css";

interface ClientOnlyProps {
  /**
   * Use this to server render a skeleton or loading state
   */
  ssr: ReactNode;
  fadeInDuration?: number;
  style?: React.CSSProperties;
}

export const ClientOnly: ComponentWithChildren<ClientOnlyProps> = ({
  children,
  fadeInDuration,
  ssr,
  style,
}) => {
  const hasMounted = useIsClientMounted();

  if (!hasMounted) {
    return <> {ssr} </>;
  }

  return (
    <div
      className={styles.fadeIn}
      style={{
        animationDuration: `${fadeInDuration}ms`,
        opacity: fadeInDuration ? 0 : 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export function useIsClientMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
