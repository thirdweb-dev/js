"use client";

import { Suspense, useEffect, useState } from "react";
import {
  ConfigureNetworkModal,
  type ConfigureNetworkModalProps,
} from "./ConfigureNetworkModal";

export function LazyConfigureNetworkModal(props: ConfigureNetworkModalProps) {
  const [hasEverOpened, setHasEverOpened] = useState(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (props.open) {
      setHasEverOpened(true);
    }
  }, [props.open]);

  if (hasEverOpened) {
    return (
      <Suspense fallback={null}>
        <ConfigureNetworkModal {...props} />
      </Suspense>
    );
  }

  return null;
}
