import { GithubIcon } from "components/icons/brand-icons/GithubIcon";
import { InstagramIcon } from "components/icons/brand-icons/InstagramIcon";
import { LinkedInIcon } from "components/icons/brand-icons/LinkedinIcon";
import { TiktokIcon } from "components/icons/brand-icons/TiktokIcon";
import { XIcon } from "components/icons/brand-icons/XIcon";
import { YoutubeIcon } from "components/icons/brand-icons/YoutubeIcon";

import type { JSX } from "react";

interface socialLinkInfo {
  link: string;
  icon: JSX.Element;
  ariaLabel: string;
  label?: string;
}

export const SOCIALS: socialLinkInfo[] = [
  {
    link: "https://twitter.com/thirdweb",
    icon: <XIcon className="size-5" />,
    ariaLabel: "Twitter",
  },
  {
    link: "https://www.youtube.com/channel/UCdzMx7Zhy5va5End1-XJFbA",
    ariaLabel: "YouTube",
    label: "youtube",
    icon: <YoutubeIcon className="size-5" />,
  },
  {
    link: "https://www.linkedin.com/company/third-web/",
    ariaLabel: "LinkedIn",
    label: "linkedin",
    icon: <LinkedInIcon className="size-5" />,
  },
  {
    link: "https://www.instagram.com/thirdweb/",
    ariaLabel: "Instagram",
    label: "instagram",
    icon: <InstagramIcon className="size-5" />,
  },
  {
    link: "https://www.tiktok.com/@thirdweb",
    ariaLabel: "TikTok",
    label: "tiktok",
    icon: <TiktokIcon className="size-5" />,
  },
  {
    link: "https://github.com/thirdweb-dev",
    ariaLabel: "GitHub",
    label: "gitHub",
    icon: <GithubIcon className="size-5" />,
  },
];
