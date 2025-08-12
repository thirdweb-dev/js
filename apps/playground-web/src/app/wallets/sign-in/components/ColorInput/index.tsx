import ColorPicker from "react-pick-color";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "../../../../../lib/utils";

export function ColorInput(props: {
  value: string;
  onChange: (value: string) => void;
  onClick?: () => void;
  className?: string;
}) {
  const debouncedOnChange = useDebouncedCallback((value: string) => {
    props.onChange(value);
  }, 100);

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            "size-10 rounded-full border transition-colors duration-100",
            props.className,
          )}
          style={{
            background: props.value,
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto border-none p-0">
        <ColorPicker
          className="p-2"
          color={props.value}
          hideAlpha
          onChange={({ hsl }) =>
            debouncedOnChange(
              `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`,
            )
          }
          theme={{
            background: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            color: "hsl(var(--foreground))",
            inputBackground: "hsl(var(--input))",
            width: "300px",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
