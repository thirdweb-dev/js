"use client";
import { createContext, useContext, useState } from "react";
import { CustomThemeProvider } from "../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../core/design-system/index.js";

const WalletModalOpen = /* @__PURE__ */ createContext(false);
const SetWalletModalOpen = /* @__PURE__ */ createContext<
  (value: boolean) => void
>(() => {});

const SelectionUIDataCtx = /* @__PURE__ */ createContext<object>({});
const SetSelectionUIDataCtx = /* @__PURE__ */ createContext<
  (value: object) => void
>(() => {});

/**
 * @internal
 */
export const WalletUIStatesProvider = (
  props: React.PropsWithChildren<{
    theme?: Theme | "dark" | "light";
    isOpen: boolean;
  }>,
) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(props.isOpen);
  const [selectionUIData, setSelectionUIData] = useState<object>({}); // allow any type of object

  return (
    <WalletModalOpen.Provider value={isWalletModalOpen}>
      <SetWalletModalOpen.Provider value={setIsWalletModalOpen}>
        <SelectionUIDataCtx.Provider value={selectionUIData}>
          <SetSelectionUIDataCtx.Provider value={setSelectionUIData}>
            <CustomThemeProvider theme={props.theme}>
              {props.children}
            </CustomThemeProvider>
          </SetSelectionUIDataCtx.Provider>
        </SelectionUIDataCtx.Provider>
      </SetWalletModalOpen.Provider>
    </WalletModalOpen.Provider>
  );
};

/**
 * @internal
 */
export const useIsWalletModalOpen = () => {
  return useContext(WalletModalOpen);
};

/**
 * @internal
 */
export const useSetIsWalletModalOpen = () => {
  const context = useContext(SetWalletModalOpen);
  if (context === undefined) {
    throw new Error(
      "useSetWalletModalOpen must be used within a ThirdwebProvider",
    );
  }
  return context;
};

/**
 * @internal
 */
export function useSetSelectionData() {
  return useContext(SetSelectionUIDataCtx);
}

/**
 * @internal
 */
export function useSelectionData() {
  return useContext(SelectionUIDataCtx);
}
