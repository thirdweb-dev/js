import type { FC, PropsWithChildren } from "react";

// biome-ignore lint/complexity/noBannedTypes: FIXME
export type ComponentWithChildren<P extends {} = {}> = FC<PropsWithChildren<P>>;
