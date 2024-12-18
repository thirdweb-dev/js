import Image from "next/image";
import Link from "next/link";

export function ConnectCard(props: {
  title: string;
  href: string;
  iconUrl: string;
  isExternal?: boolean;
}) {
  return (
    <Link
      href={props.href}
      target={props.isExternal ? "_blank" : undefined}
      className="flex cursor-default"
    >
      <article className="group/article flex w-full items-center overflow-hidden rounded-lg border bg-b-800 transition-colors duration-300 hover:border-accent-500 hover:bg-accent-900">
        <div className="flex w-full items-center gap-4 p-4">
          <Image src={props.iconUrl} width={40} height={40} alt="" />
          <h3 className="font-medium text-base">{props.title}</h3>
        </div>
      </article>
    </Link>
  );
}
