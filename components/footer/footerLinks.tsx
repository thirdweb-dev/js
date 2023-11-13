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
    link: "https://portal.thirdweb.com/typescript",
  },
  {
    label: "react",
    name: "React",
    link: "https://portal.thirdweb.com/react",
  },
  {
    label: "python",
    name: "Python",
    link: "https://portal.thirdweb.com/python",
  },
  {
    label: "contracts",
    name: "Contracts",
    link: "https://portal.thirdweb.com/solidity",
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
    link: "https://ipfs.io/ipfs/QmTWMy6Dw1PDyMxHxNcmDmPE8zqFCQMfD6m2feHVY89zgu/",
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
