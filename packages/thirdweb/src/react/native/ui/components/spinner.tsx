import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

type ThemedSpinnerProps = ActivityIndicatorProps;

export function ThemedSpinner(props: ThemedSpinnerProps) {
  return <ActivityIndicator {...props} />;
}
