import type { StaticImageData } from "next/image";

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
