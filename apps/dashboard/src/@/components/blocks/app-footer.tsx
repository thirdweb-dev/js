import { ThirdwebMiniLogo } from "app/(app)/components/ThirdwebMiniLogo";
import { GithubIcon } from "components/icons/brand-icons/GithubIcon";
import { InstagramIcon } from "components/icons/brand-icons/InstagramIcon";
import { LinkedInIcon } from "components/icons/brand-icons/LinkedinIcon";
import { RedditIcon } from "components/icons/brand-icons/RedditIcon";
import { TiktokIcon } from "components/icons/brand-icons/TiktokIcon";
import { XIcon } from "components/icons/brand-icons/XIcon";
import { YoutubeIcon } from "components/icons/brand-icons/YoutubeIcon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppFooterProps = {
  className?: string;
  containerClassName?: string;
};

const footerLinks = [
  {
    href: "/home",
    label: "Home",
  },
  {
    href: "https://blog.thirdweb.com",
    label: "Blog",
  },
  {
    href: "https://portal.thirdweb.com/changelog",
    label: "Changelog",
  },
  {
    href: "https://feedback.thirdweb.com/",
    label: "Feedback",
  },
  {
    href: "https://thirdweb.com/privacy-policy",
    label: "Privacy Policy",
  },
  {
    href: "https://thirdweb.com/terms",
    label: "Terms of Service",
  },
  {
    href: "https://thirdweb.com/chainlist",
    label: "Chainlist",
  },
];

export function AppFooter(props: AppFooterProps) {
  return (
    <footer
      className={cn(
        "w-full border-border border-t py-6 md:py-8",
        props.className,
      )}
    >
      <div
        className={cn(
          "container flex flex-col gap-4 md:gap-6",
          props.containerClassName,
        )}
      >
        {/* top row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row items-center gap-3">
            <ThirdwebMiniLogo className="h-7" />
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} thirdweb
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button asChild className="size-9" size="icon" variant="ghost">
              <Link
                href="https://github.com/thirdweb-dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <GithubIcon className="size-5 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="size-9" size="icon" variant="ghost">
              <Link
                href="https://www.tiktok.com/@thirdweb"
                rel="noopener noreferrer"
                target="_blank"
              >
                <TiktokIcon className="size-5 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="size-9" size="icon" variant="ghost">
              <Link
                href="https://www.instagram.com/thirdweb/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <InstagramIcon className="size-5 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="size-9" size="icon" variant="ghost">
              <Link
                href="hhttps://www.linkedin.com/company/third-web/"
                target="_blank"
              >
                <LinkedInIcon className="size-5 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="size-9" size="icon" variant="ghost">
              <Link
                href="https://www.youtube.com/@thirdweb_"
                rel="noopener noreferrer"
                target="_blank"
              >
                <YoutubeIcon className="size-5 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="size-9" size="icon" variant="ghost">
              <Link
                href="https://www.reddit.com/r/thirdweb/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <RedditIcon className="size-5 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="size-9" size="icon" variant="ghost">
              <Link
                href="https://x.com/thirdweb"
                rel="noopener noreferrer"
                target="_blank"
              >
                <XIcon className="size-5 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>
        {/* bottom row */}
        <div className="grid grid-flow-col grid-cols-2 grid-rows-5 gap-2 md:flex md:flex-row md:justify-between">
          {footerLinks.map((link) => (
            <FooterLink key={link.href} {...link} />
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterLink(props: {
  href: string;
  label: string;
  prefetch?: boolean;
}) {
  return (
    <Link
      className="px-0 py-[6px] text-muted-foreground text-sm hover:underline"
      href={props.href}
      prefetch={false}
      target="_blank"
    >
      {props.label}
    </Link>
  );
}
