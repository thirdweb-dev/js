import { FC, PropsWithChildren } from "react";

export type ComponentWithChildren<P extends {} = {}> = FC<PropsWithChildren<P>>;
