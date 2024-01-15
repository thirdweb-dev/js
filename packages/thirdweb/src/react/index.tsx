import { createContext } from "react";

const ThirdwebContext = createContext({});

export type ThirdwebProviderProps = {
  foo: string;
};

export const ThirdwebProvider: React.FC<
  React.PropsWithChildren<ThirdwebProviderProps>
> = ({ children }) => {
  return (
    <ThirdwebContext.Provider value={{}}>{children}</ThirdwebContext.Provider>
  );
};
