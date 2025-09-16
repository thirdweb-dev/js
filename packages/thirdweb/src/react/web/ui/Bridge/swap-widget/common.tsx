import type { Theme } from "../../../../core/design-system/index.js";
import { Text } from "../../components/text.js";

export function DecimalRenderer(props: {
  value: string;
  color: keyof Theme["colors"];
  weight: 400 | 500 | 600 | 700;
  integerSize: "md" | "sm";
  fractionSize: "sm" | "xs";
}) {
  if (Number(props.value) > 1000) {
    return (
      <Text size={props.integerSize} color={props.color} weight={props.weight}>
        {compactFormatter.format(Number(props.value))}
      </Text>
    );
  }
  const [integerPart, fractionPart] = props.value.split(".");

  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <Text size={props.integerSize} color={props.color} weight={props.weight}>
        {integerPart}
      </Text>
      <Text size={props.fractionSize} color={props.color} weight={props.weight}>
        .{fractionPart || "00"}
      </Text>
    </div>
  );
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});
