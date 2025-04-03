import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { LinkIcon } from "lucide-react";

type FooterSectionProps = {
  title: string;
  links: {
    href: string;
    label: string;
  }[];
};

type FooterCardProps = {
  left: FooterSectionProps;
  center: FooterSectionProps;
  right: FooterSectionProps;
  trackingCategory: string;
};

export function FooterLinksSection(props: FooterCardProps) {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-0 xl:divide-x xl:divide-border">
        <div className="xl:pr-6">
          <FooterSection
            {...props.left}
            trackingCategory={props.trackingCategory}
          />
        </div>

        <div className="xl:px-6">
          <FooterSection
            {...props.center}
            trackingCategory={props.trackingCategory}
          />
        </div>

        <div className="xl:pl-6">
          <FooterSection
            {...props.right}
            trackingCategory={props.trackingCategory}
          />
        </div>
      </div>
    </div>
  );
}

function FooterSection(
  props: FooterSectionProps & { trackingCategory: string },
) {
  return (
    <div>
      <h3 className="mb-2.5 font-medium">{props.title}</h3>
      <div className="flex flex-col gap-2.5">
        {props.links.map((link) => (
          <FooterLink
            key={link.label}
            href={link.href}
            trackingCategory={props.trackingCategory}
            label={link.label}
          />
        ))}
      </div>
    </div>
  );
}

function FooterLink({
  href,
  label,
  trackingCategory,
}: {
  href: string;
  label: string;
  trackingCategory: string;
}) {
  return (
    <TrackedLinkTW
      href={href}
      category={trackingCategory}
      label={label.replace(/ /g, "-").toLowerCase()}
      target="_blank"
      className="flex items-start gap-2 text-balance text-muted-foreground text-sm hover:text-foreground"
    >
      <LinkIcon className="mt-1 size-3 shrink-0 opacity-70" />
      {label}
    </TrackedLinkTW>
  );
}
