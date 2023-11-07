import React, { useState } from "react";
import Text from "./Text";
import CheckedIcon from "../../assets/checked-icon";
import BaseButton from "./BaseButton";
import Box from "./Box";

interface CheckboxProps {
  label: string;
  color: string;
  value?: boolean;
  onToggle?: (value: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  color,
  onToggle,
  value = false,
}) => {
  const [isChecked, setIsChecked] = useState(value);

  const onPress = () => {
    setIsChecked(!isChecked);
    onToggle?.(!isChecked);
  };

  return (
    <BaseButton flexDirection="row" alignItems="center" onPress={onPress}>
      <Box borderRadius="md" style={{ borderColor: color }} borderWidth={1}>
        {isChecked ? (
          <CheckedIcon width={20} height={20} color={color} />
        ) : (
          <Box width={20} height={20} />
        )}
      </Box>
      <Text variant="bodySmall" ml="xxs">
        {label}
      </Text>
    </BaseButton>
  );
};

export default Checkbox;
