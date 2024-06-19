/* eslint-disable react/forbid-dom-props */
import { Box, Flex, Input, Spacer } from "@chakra-ui/react";
import { FormLabel } from "tw-components";
import styles from "./ColorInput.module.css";

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function ColorInput(props: {
  value: string;
  name: string;
  onChange: (value: string) => void;
  onClick?: () => void;
}) {
  let hexColor = props.value;
  if (props.value.startsWith("hsl(") && props.value.endsWith(")")) {
    const [h, s, l] = props.value
      .replace(/[^0-9.]/g, " ")
      .split(/\s+/)
      .filter((value) => value)
      .map(Number);

    // if all three are numbers
    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      hexColor = hslToHex(h, s, l);
    } else {
      // give up
      hexColor = props.value;
    }
  }

  return (
    <Box>
      <FormLabel>{props.name}</FormLabel>
      <Spacer height={2} />
      <Flex alignItems="center" gap={3} onClick={props.onClick}>
        <input
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          type="color"
          className={styles.ColorInput}
          value={hexColor}
        />

        <Input
          value={hexColor}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      </Flex>
    </Box>
  );
}
