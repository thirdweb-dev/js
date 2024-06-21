import type { IconType } from "@react-icons/all-files";
import type { StaticImageData } from "next/image";

export interface SectionProps {
  name: string;
  label: string;
  description: string;
  icon?: StaticImageData;
  link?: string;
  section?: "contracts-v2" | "connect-v2" | "engine-v2";
  iconType?: IconType;
  comingSoon?: boolean;
}

export interface SectionItemProps {
  name: string;
  dashboardName?: string;
  label: string;
  description: string;
  link: string;
  dashboardLink?: string;
  icon?: StaticImageData;
  iconType?: IconType;
  comingSoon?: boolean;
  inLandingPage?: boolean;
  section:
    | "contracts"
    | "connect"
    | "infrastructure"
    | "payments"
    | "solutions"
    | "resources"
    | "tools"
    | "sdks"
    | "company";
}
