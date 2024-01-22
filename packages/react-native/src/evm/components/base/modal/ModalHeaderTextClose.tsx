import { View } from "react-native";
import { Icon } from "../../../assets/icon";
import Box from "../Box";
import Text from "../Text";
import { ReactNode } from "react";
import { useGlobalTheme } from "../../../providers/ui-context-provider";

interface ModalHeaderTextCloseProps {
  onClose?: () => void;
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  onBackPress?: () => void;
}

/**
 * @internal
 */
export const ModalHeaderTextClose = ({
  headerText,
  subHeaderText,
  onClose,
  onBackPress,
  ...props
}: ModalHeaderTextCloseProps & React.ComponentProps<typeof Box>) => {
  const theme = useGlobalTheme();

  return (
    <>
      <Box
        flexDirection="row"
        justifyContent={headerText ? "space-between" : "flex-end"}
        {...props}
      >
        {onBackPress ? (
          <Icon
            type="back"
            width={16}
            height={16}
            onPress={onBackPress}
            color={theme.colors.iconPrimary}
          />
        ) : null}
        {typeof headerText === "string" ? (
          <Text variant="header">{headerText}</Text>
        ) : (
          headerText
        )}
        {onClose ? (
          <Icon
            type="close"
            width={16}
            height={16}
            color={theme.colors.iconSecondary}
            onPress={onClose}
          />
        ) : (
          <View />
        )}
      </Box>
      {!subHeaderText ? null : typeof subHeaderText === "string" ? (
        <Box mt="md">
          <Text variant="subHeader">{subHeaderText}</Text>
        </Box>
      ) : (
        <Box mt="md">{subHeaderText}</Box>
      )}
    </>
  );
};
