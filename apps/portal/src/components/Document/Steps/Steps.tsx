import { cn } from "../../../lib/utils";
import { Heading } from "..";
import styles from "./Steps.module.css";

export function Steps(props: { children: React.ReactNode }) {
  return (
    <div className={cn("pl-4", styles.steps, "relative my-5")}>
      <ul className="border-l py-4 pl-8 [&_li:first-child_[data-step]_div:first-child]:mt-0">
        {props.children}
      </ul>
    </div>
  );
}

export function Step(props: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <li>
      <div data-step>
        <Heading anchorId={props.id || props.title} level={3}>
          {props.title}
        </Heading>
      </div>
      <div>{props.children}</div>
    </li>
  );
}
