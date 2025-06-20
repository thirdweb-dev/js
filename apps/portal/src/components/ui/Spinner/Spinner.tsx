import { cn } from "../../../lib/utils";
import style from "./Spinner.module.css";

export function Spinner(props: { className?: string }) {
  return (
    <svg className={cn(style.loader, props.className)} viewBox="0 0 50 50">
      <title>Loading</title>
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
