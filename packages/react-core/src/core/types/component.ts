import React from "react";

export type ComponentWithChildren<P = unknown> = React.FC<
  React.PropsWithChildren<P>
>;
