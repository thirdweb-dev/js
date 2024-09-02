import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function DocsButton(props: {
  link: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={props.link}
      target="_blank"
      className={`${buttonVariants({ variant: "outline" })} flex items-center`}
    >
      {props.icon}
      <span className="ml-2">{props.label}</span>
    </Link>
  );
}
