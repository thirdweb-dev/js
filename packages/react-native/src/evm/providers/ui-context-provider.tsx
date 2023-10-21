import { createContext, useContext, useMemo, useState } from "react";
import { ModalState } from "../utils/modalTypes";
import { ThemeProviderProps } from "../styles/ThemeProvider";
import { Theme, _darkTheme, _lightTheme } from "../styles/theme";
import { useAppTheme } from "../styles/hooks";
import { useTheme } from "@shopify/restyle";
import { PropsWithChildren } from "react";
import { Locale } from "../i18n/types";
import { setLocale } from "../i18n/strings";

type UIContextType = {
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
  theme: ThemeProviderProps["theme"];
  setTheme: (theme: ThemeProviderProps["theme"]) => void;
  locale: Locale;
};

const UIContext = createContext<UIContextType>({
  modalState: {
    view: "Closed",
    data: {},
    isOpen: false,
    isSheet: true,
    caller: "init",
  },
  setModalState: () => undefined,
  theme: "light",
  setTheme: () => undefined,
  locale: "en",
});

export const UIContextProvider = (
  props: { locale: Locale } & PropsWithChildren,
) => {
  const [modalState, setModalState] = useState<ModalState>({
    view: "Closed",
    data: {},
    isOpen: false,
    isSheet: true,
    caller: "init",
  });

  const providerTheme = useAppTheme();

  const [theme, setTheme] =
    useState<ThemeProviderProps["theme"]>(providerTheme);

  return (
    <UIContext.Provider
      value={{
        modalState,
        setModalState,
        theme,
        setTheme,
        locale: props.locale,
      }}
    >
      {props.children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  return useContext(UIContext);
};

export const useModalState = (): {
  modalState: ModalState;
  setModalState: UIContextType["setModalState"];
} => {
  const context = useContext(UIContext);

  return {
    modalState: context.modalState,
    setModalState: context.setModalState,
  };
};

export const useLocale = () => {
  const context = useContext(UIContext);

  return setLocale(context.locale);
};

const getThemeObj = (theme?: ThemeProviderProps["theme"]) => {
  if (theme === "dark" || !theme) {
    return _darkTheme;
  } else if (theme === "light") {
    return _lightTheme;
  } else {
    return theme;
  }
};

export const useGlobalTheme = (theme?: ThemeProviderProps["theme"]): Theme => {
  const context = useContext(UIContext);
  const appTheme = useTheme();

  const resultTheme = useMemo(() => {
    const resp = getThemeObj(context.theme) || getThemeObj(theme) || appTheme;
    return resp;
  }, [theme, context, appTheme]);

  return resultTheme;
};
