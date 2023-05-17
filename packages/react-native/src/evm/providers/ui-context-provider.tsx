import { createContext, useContext, useState } from "react";
import { ModalState } from "../utils/modalTypes";

type UIContextType = {
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
};

const UIContext = createContext<UIContextType>({
  modalState: {
    view: "None",
    data: {},
    isOpen: false,
  },
  setModalState: () => {},
});

export const UIContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [modalState, setModalState] = useState<ModalState>({
    view: "None",
    data: {},
    isOpen: false,
  });

  return (
    <UIContext.Provider value={{ modalState, setModalState }}>
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
