import { IconType } from "@react-icons/all-files";
import { StaticImageData } from "next/image";

export interface SectionProps {
  name: string;
  label: string;
  description: string;
  icon?: StaticImageData;
}

export interface SectionItemProps {
  name: string;
  label: string;
  description: string;
  link: string;
  icon?: StaticImageData;
  iconType?: IconType;
  comingSoon?: boolean;
  section:
    | "contracts"
    | "wallets"
    | "infrastructure"
    | "payments"
    | "solutions"
    | "resources"
    | "tools"
    | "sdks"
    | "company";
}
