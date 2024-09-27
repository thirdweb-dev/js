import { SiInstagram } from "@react-icons/all-files/si/SiInstagram";
import { SiTiktok } from "@react-icons/all-files/si/SiTiktok";
import { SiYoutube } from "@react-icons/all-files/si/SiYoutube";
import { DiscordIcon } from "components/icons/brand-icons/DiscordIcon";
import { GithubIcon } from "components/icons/brand-icons/GithubIcon";
import { LinkedInIcon } from "components/icons/brand-icons/LinkedinIcon";
import { XIcon } from "components/icons/brand-icons/XIcon";

interface socialLinkInfo {
  link: string;
  icon: JSX.Element;
  ariaLabel: string;
  label?: string;
}

const socialIconSize = "1.25rem";

export const SOCIALS: socialLinkInfo[] = [
  {
    link: "https://twitter.com/thirdweb",
    icon: <XIcon fontSize={socialIconSize} className="size-5" />,
    ariaLabel: "Twitter",
  },
  {
    icon: <DiscordIcon className="size-5" />,
    ariaLabel: "Discord",
    label: "discord",
    link: "https://discord.gg/thirdweb",
  },
  {
    link: "https://www.youtube.com/channel/UCdzMx7Zhy5va5End1-XJFbA",
    ariaLabel: "YouTube",
    label: "youtube",
    icon: <SiYoutube fontSize={socialIconSize} />,
  },
  {
    link: "https://www.linkedin.com/company/third-web/",
    ariaLabel: "LinkedIn",
    label: "linkedin",
    icon: <LinkedInIcon fontSize={socialIconSize} className="size-5" />,
  },
  {
    link: "https://www.instagram.com/thirdweb/",
    ariaLabel: "Instagram",
    label: "instagram",
    icon: <SiInstagram fontSize={socialIconSize} />,
  },
  {
    link: "https://www.tiktok.com/@thirdweb",
    ariaLabel: "TikTok",
    label: "tiktok",
    icon: <SiTiktok fontSize={socialIconSize} />,
  },
  {
    link: "https://github.com/thirdweb-dev",
    ariaLabel: "GitHub",
    label: "gitHub",
    icon: <GithubIcon fontSize={socialIconSize} className="size-5" />,
  },
];
