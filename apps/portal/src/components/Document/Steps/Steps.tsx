import { Heading } from "..";
import { cn } from "../../../lib/utils";
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
        <Heading level={3} id={props.id || props.title}>
          {props.title}
        </Heading>
      </div>
      <div>{props.children}</div>
    </li>
  );
}
