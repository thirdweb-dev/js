import { cn } from "@/lib/utils";
import styles from "./List.module.css";

export function UnorderedList(props: { children?: React.ReactNode }) {
  return (
    <ul className={cn(styles.unorderedList, "text-muted-foreground")}>
      {props.children}
    </ul>
  );
}

export function OrderedList(props: { children?: React.ReactNode }) {
  return (
    <ul className={cn(styles.orderedList, "text-muted-foreground")}>
      {props.children}
    </ul>
  );
}
