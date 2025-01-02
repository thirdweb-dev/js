import { cn } from "../../../lib/utils";
import style from "./Spinner.module.css";

export function Spinner(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 50"
      className={cn(style.loader, props.className || "size-4")}
    >
      <title>loading</title>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}
