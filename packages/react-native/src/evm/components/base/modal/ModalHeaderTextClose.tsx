import { Icon } from "../../../assets/icon";
import { useAppTheme } from "../../../styles/hooks";
import Box from "../Box";
import Text from "../Text";
import { ReactNode } from "react";

interface ModalHeaderTextCloseProps {
  onClose: () => void;
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
}

export const ModalHeaderTextClose = ({
  headerText,
  subHeaderText,
  onClose,
  ...props
}: ModalHeaderTextCloseProps & React.ComponentProps<typeof Box>) => {
  const theme = useAppTheme();

  return (
    <>
      <Box
        flexDirection="row"
        justifyContent={headerText ? "space-between" : "flex-end"}
        {...props}
      >
        {typeof headerText === "string" ? (
          <Text variant="header">{headerText}</Text>
        ) : (
          headerText
        )}
        <Icon
          type="close"
          width={14}
          height={14}
          color={theme.colors.iconSecondary}
          onPress={onClose}
        />
      </Box>
      <Box flexDirection="row" justifyContent="space-between" mt="md">
        {typeof subHeaderText === "string" ? (
          <Text variant="subHeader">{subHeaderText}</Text>
        ) : (
          subHeaderText
        )}
      </Box>
    </>
  );
};
