import type { Theme } from "../../../../core/design-system/index.js";
import { Text } from "../../components/text.js";

export function DecimalRenderer(props: {
  value: string;
  color: keyof Theme["colors"];
  weight: 400 | 500 | 600 | 700;
  integerSize: "md" | "sm";
  fractionSize: "sm" | "xs";
}) {
  const [integerPart, fractionPart] = props.value.split(".");
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <Text size={props.integerSize} color={props.color} weight={props.weight}>
        {integerPart}.
      </Text>
      <Text size={props.fractionSize} color={props.color} weight={props.weight}>
        {fractionPart || "00000"}
      </Text>
    </div>
  );
}
