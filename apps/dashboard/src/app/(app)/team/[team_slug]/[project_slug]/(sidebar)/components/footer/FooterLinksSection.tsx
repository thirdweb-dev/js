import Link from "next/link";

type FooterSectionProps = {
  title: string;
  links: {
    href: string;
    label: string;
  }[];
};

export type FooterCardProps = {
  left: FooterSectionProps;
  center: FooterSectionProps;
  right: FooterSectionProps;
};

export function FooterLinksSection(props: FooterCardProps) {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 gap-6 divide-dashed max-sm:divide-y xl:grid-cols-3 xl:gap-0 xl:divide-x xl:divide-border">
        <div className="xl:pr-6">
          <FooterSection {...props.left} />
        </div>

        <div className="max-sm:pt-4 xl:px-6">
          <FooterSection {...props.center} />
        </div>

        <div className="max-sm:pt-4 xl:pl-6">
          <FooterSection {...props.right} />
        </div>
      </div>
    </div>
  );
}

function FooterSection(props: FooterSectionProps) {
  return (
    <div>
      <h3 className="mb-2.5 font-semibold text-lg">{props.title}</h3>
      <div className="flex flex-col gap-2.5">
        {props.links.map((link) => (
          <FooterLink href={link.href} key={link.label} label={link.label} />
        ))}
      </div>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="flex items-start gap-2 text-balance text-muted-foreground text-sm hover:text-foreground"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </Link>
  );
}
