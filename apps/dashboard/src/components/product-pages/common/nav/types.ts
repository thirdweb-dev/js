import type { StaticImageData } from "next/image";

export interface SectionProps {
  name: string;
  label: string;
  description: string;
  icon?: StaticImageData;
  link?: string;
  section?: "contracts-v2" | "connect-v2" | "engine-v2";
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
