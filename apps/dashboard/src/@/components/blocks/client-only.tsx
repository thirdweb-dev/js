"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ClientOnlyProps {
  /**
   * Use this to server render a skeleton or loading state
   */
  ssr: ReactNode;
  className?: string;
  children: ReactNode;
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({
  children,
  ssr,
  className,
}) => {
  const hasMounted = useIsClientMounted();

  if (!hasMounted) {
    return <> {ssr} </>;
  }

  return (
    <div className={cn("fade-in-0 fill-mode-forwards ease-in", className)}>
      {children}
    </div>
  );
};

function useIsClientMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
