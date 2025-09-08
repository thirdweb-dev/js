import { cn } from "@/lib/utils";
import styles from "./List.module.css";

export function UnorderedList(props: { children?: React.ReactNode }) {
  return <ul className={cn(styles.unorderedList)}>{props.children}</ul>;
}

export function OrderedList(props: { children?: React.ReactNode }) {
  return <ul className={cn(styles.orderedList)}>{props.children}</ul>;
}
