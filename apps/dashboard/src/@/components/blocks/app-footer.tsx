import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiLinkedin,
  SiReddit,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { ThirdwebMiniLogo } from "../../../app/components/ThirdwebMiniLogo";

type AppFooterProps = {
  className?: string;
};

export function AppFooter(props: AppFooterProps) {
  return (
    <footer
      className={cn(
        "bg-background border-t border-border py-6 md:py-8 w-full",
        props.className,
      )}
    >
      <div className="container flex flex-col gap-4 md:gap-6">
        {/* top row */}
        <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
          <div className="flex flex-row gap-3 items-center">
            <ThirdwebMiniLogo className="h-7" />
            <p className="text-sm text-secondary-foreground">© 2024 thirdweb</p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link href="https://github.com/thirdweb-dev" target="_blank">
                <SiGithub className="text-secondary-foreground size-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link href="https://www.tiktok.com/@thirdweb" target="_blank">
                <SiTiktok className="text-secondary-foreground size-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link href="https://www.instagram.com/thirdweb/" target="_blank">
                <SiInstagram className="text-secondary-foreground size-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link
                href="hhttps://www.linkedin.com/company/third-web/"
                target="_blank"
              >
                <SiLinkedin className="text-secondary-foreground size-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link href="https://www.youtube.com/@thirdweb_" target="_blank">
                <SiYoutube className="text-secondary-foreground size-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link href="https://discord.gg/thirdweb" target="_blank">
                <SiDiscord className="text-secondary-foreground size-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link href="https://www.reddit.com/r/thirdweb/" target="_blank">
                <SiReddit className="text-secondary-foreground size-5" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="size-9">
              <Link href="https://x.com/thirdweb" target="_blank">
                <SiX className="text-secondary-foreground size-5" />
              </Link>
            </Button>
          </div>
        </div>
        {/* bottom row */}
        <div className="grid grid-rows-5 grid-cols-2 grid-flow-col gap-2 md:flex md:flex-row md:justify-between">
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="/"
          >
            Home
          </Link>
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="https://blog.thirdweb.com"
            target="_blank"
          >
            Blog
          </Link>
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="https://portal.thirdweb.com/changelog"
            target="_blank"
          >
            Changelog
          </Link>
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="https://feedback.thirdweb.com/"
            target="_blank"
          >
            Feedback
          </Link>
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="https://thirdweb.com/privacy"
            target="_blank"
          >
            Privacy Policy
          </Link>
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="https://thirdweb.com/tos"
            target="_blank"
          >
            Terms of Service
          </Link>
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="https://thirdweb.com/gas"
            target="_blank"
          >
            Gas Estimator
          </Link>
          <Link
            className="py-[6px] px-[10px] text-secondary-foreground text-sm hover:underline"
            href="https://thirdweb.com/chainlist"
            target="_blank"
          >
            Chain List
          </Link>
        </div>
      </div>
    </footer>
  );
}
