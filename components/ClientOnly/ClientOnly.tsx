/* eslint-disable react/forbid-dom-props */
import styles from "./ClientOnly.module.css";
import { ReactNode, useEffect, useState } from "react";

interface ClientOnlyProps {
  /**
   * Use this to server render a skeleton or loading state
   */
  ssr: ReactNode;
  children: ReactNode;
  fadeInDuration?: number;
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({
  children,
  fadeInDuration,
  ssr,
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <> {ssr} </>;
  }

  return (
    <div
      className={styles.fadeIn}
      style={{
        animationDuration: `${fadeInDuration}ms`,
        opacity: fadeInDuration ? 0 : 1,
      }}
    >
      {children}
    </div>
  );
};
