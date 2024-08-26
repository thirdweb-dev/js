import { useDebouncedCallback } from "use-debounce";
import styles from "./ColorInput.module.css";

export function ColorInput(props: {
  value: string;
  onChange: (value: string) => void;
  onClick?: () => void;
  className?: string;
}) {
  const debouncedOnChange = useDebouncedCallback((value) => {
    props.onChange(value);
  }, 100);

  return (
    <input
      onChange={(e) => {
        debouncedOnChange(e.target.value);
      }}
      type="color"
      className={`${styles.ColorInput} ${props.className}`}
      value={props.value}
    />
  );
}
