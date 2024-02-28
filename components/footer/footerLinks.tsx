export interface FooterLinkInfo {
  label: string;
  name: string;
  link: string;
}

export const COMMUNITY: FooterLinkInfo[] = [
  {
    label: "events",
    name: "Events",
    link: "/events",
  },
  {
    link: "/ambassadors",
    name: "Ambassadors",
    label: "ambassadors",
  },
  {
    link: "/learn",
    name: "thirdweb learn",
    label: "thirdweb-learn",
  },
  {
    name: "Report Abuse",
    label: "abuse",
    link: "/abuse",
  },
];

export const SDKs: FooterLinkInfo[] = [
  {
    label: "javascript",
    name: "JavaScript",
    link: "https://portal.thirdweb.com/typescript/latest",
  },
  {
    label: "react",
    name: "React",
    link: "https://portal.thirdweb.com/react/latest",
  },
  // {
  //   label: "python",
  //   name: "Python",
  //   link: "https://portal.thirdweb.com/python",
  // },
  {
    label: "contracts",
    name: "Contracts",
    link: "https://portal.thirdweb.com/contracts/build/overview",
  },
];

export const NETWORKS: FooterLinkInfo[] = [
  {
    name: "Chainlist",
    label: "chains",
    link: "/chains",
  },
];

export const COMPANY: FooterLinkInfo[] = [
  {
    label: "about",
    name: "About us",
    link: "/about",
  },
  {
    name: "Mission",
    label: "mission",
    link: "/mission",
  },
  {
    label: "blog",
    name: "Blog",
    link: "https://blog.thirdweb.com",
  },
  {
    label: "pricing",
    name: "Pricing",
    link: "/pricing",
  },
  {
    name: "Careers",
    label: "careers",
    link: "https://careers.thirdweb.com/",
  },
  {
    name: "Press Kit",
    label: "press-kit",
    link: "https://thirdweb.notion.site/00605c7c37a74141967cfe68262baefa?v=18a8db229e094fc2884e75be86825e7d&pvs=4",
  },
  {
    name: "Privacy Policy",
    label: "privacy",
    link: "/privacy",
  },
  {
    name: "Terms of Service",
    label: "terms",
    link: "/tos",
  },
];
