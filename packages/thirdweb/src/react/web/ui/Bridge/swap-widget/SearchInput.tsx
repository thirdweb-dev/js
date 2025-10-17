import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Input } from "../../components/formElements.js";

export function SearchInput(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Container color="secondaryText">
        <MagnifyingGlassIcon
          width={iconSize.md}
          height={iconSize.md}
          style={{
            position: "absolute",
            left: spacing.sm,
            top: "50%",
            borderRadius: radius.lg,
            transform: "translateY(-50%)",
          }}
        />
      </Container>

      <Input
        variant="outline"
        placeholder={props.placeholder}
        value={props.value}
        sm
        style={{
          paddingLeft: "44px",
        }}
        onChange={(e) => props.onChange(e.target.value)}
        autoFocus={props.autoFocus}
      />
    </div>
  );
}
