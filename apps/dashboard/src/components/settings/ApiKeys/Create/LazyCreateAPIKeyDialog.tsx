"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import type { CreateAPIKeyDialogProps } from "./index";

const CreateAPIKeyDialog = lazy(() => import("./index"));

export function LazyCreateAPIKeyDialog(props: CreateAPIKeyDialogProps) {
  // if we use props.open to conditionally render the lazy component, - the dialog will close suddenly when the user closes it instead of gracefully fading out
  // and we can't render the dialog unconditionally because it will be rendered on the first page load and that defeats the purpose of lazy loading
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
        <CreateAPIKeyDialog {...props} />
      </Suspense>
    );
  }

  return null;
}
