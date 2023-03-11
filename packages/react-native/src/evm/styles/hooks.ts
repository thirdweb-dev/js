import { Theme } from "./theme";
import { useTheme } from "@shopify/restyle";

export const useAppTheme = () => useTheme<Theme>();
