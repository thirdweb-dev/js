import { createContext, useContext, useMemo, useState } from "react";
import { ModalState } from "../utils/modalTypes";
import { ThemeProviderProps } from "../styles/ThemeProvider";
import { Theme, darkTheme, lightTheme } from "../styles/theme";
import { useAppTheme } from "../styles/hooks";
import { useTheme } from "@shopify/restyle";

type UIContextType = {
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
  theme: ThemeProviderProps["theme"];
  setTheme: (theme: ThemeProviderProps["theme"]) => void;
};

const UIContext = createContext<UIContextType>({
  modalState: {
    view: "Closed",
    data: {},
    isOpen: false,
    isSheet: true,
    caller: "init",
  },
  setModalState: () => {},
  theme: darkTheme(),
  setTheme: () => {},
});

export const UIContextProvider = (props: React.PropsWithChildren<{}>) => {
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
    <UIContext.Provider value={{ modalState, setModalState, theme, setTheme }}>
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

const getThemeObj = (theme?: ThemeProviderProps["theme"]) => {
  if (theme === "dark" || !theme) {
    return darkTheme();
  } else if (theme === "light") {
    return lightTheme();
  } else {
    return theme;
  }
};

export const useGlobalTheme = (theme?: ThemeProviderProps["theme"]): Theme => {
  const context = useContext(UIContext);
  const appTheme = useTheme();

  const resultTheme = useMemo(() => {
    const resp = getThemeObj(theme) || getThemeObj(context.theme) || appTheme;
    return resp;
  }, [theme, context, appTheme]);

  return resultTheme;
};
