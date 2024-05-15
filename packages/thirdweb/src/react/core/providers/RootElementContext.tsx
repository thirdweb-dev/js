"use client";
import { createContext } from "react";

export const SetRootElementContext = createContext<
  (el: React.ReactNode) => void
>(() => {});
