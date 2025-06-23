import { cn } from "../../../lib/utils";
import style from "./Spinner.module.css";

export function Spinner(props: { className?: string }) {
  return (
    <svg
      className={cn(style.loader, props.className || "size-4")}
      viewBox="0 0 50 50"
    >
      <title>loading</title>
      <circle
        cx="25"
        cy="25"
        fill="none"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}
