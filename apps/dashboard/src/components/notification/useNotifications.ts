import { useQuery } from "@tanstack/react-query";

export type NotificationInfo = {
  title: string;
  description?: string;
  href: string;
  type:
    | "changelog"
    | "tweet"
    | "article"
    | "youtube"
    | "version-release"
    | "alert";
  isRead: boolean;
  image?: string;
  timestamp: string;
};

const notifications: NotificationInfo[] = [
  {
    title: "HOT Contracts! ️‍🔥",
    description: "See what's hot onchain right now",
    href: "https://x.com/joenrv/status/1811167541982908596",
    type: "tweet",
    isRead: false,
    image:
      "https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fpbs.twimg.com%2Ftweet_video_thumb%2FGSKN4l9bkAAx1ho.jpg%3Alarge",
    timestamp: new Date("July 11, 2024").toISOString(),
  },
  {
    title: "What is Avalanche?",
    description:
      "Learn How To Deploy Smart Contracts and Build Apps on Avalanche",
    href: "https://www.youtube.com/watch?v=VV4M1coSHig",
    type: "youtube",
    isRead: true,
    image: "https://i3.ytimg.com/vi/VV4M1coSHig/maxresdefault.jpg",
    timestamp: new Date("July 11, 2024").toISOString(),
  },
  {
    title: "Day 9 of the Onchain Olympics: Mantle",
    description:
      "Mantle ecosystem is growing rapidly, with over 110 apps deployed. Mint the commemorative NFT and receive future perks for building on Mantle with thirdweb. ✨",
    href: "https://x.com/thirdweb/status/1811435801101897973",
    type: "tweet",
    isRead: false,
    image:
      "https://pbs.twimg.com/card_img/1810698046323187712/9FQbvao1?format=png&name=medium",
    timestamp: new Date("July 11, 2024").toISOString(),
  },
  {
    title: "Introducing Ecosystem Wallets",
    description:
      "One cohesive, interoperable identity across every app and game in your ecosystem.",
    href: "https://x.com/thirdweb/status/1811098388949258648",
    type: "tweet",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2024/07/Frame-2.png",
    isRead: false,
    timestamp: new Date("July 10, 2024").toISOString(),
  },
  {
    title: "What is ZKSync?",
    description: "Scaling Ethereum with zero-knowledge proofs",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2024/07/Chainhub-zkSync-1.png",
    isRead: true,
    type: "article",
    href: "https://blog.thirdweb.com/scaling-ethereum-with-zksync-layer-2-solution/",
    timestamp: new Date("July 10, 2024").toISOString(),
  },
  {
    title: "New version of thirdweb SDK released",
    href: "https://github.com/thirdweb-dev/js/releases/tag/thirdweb%405.30.0",
    description: "thirdweb@5.30.0",
    isRead: false,
    type: "version-release",
    timestamp: new Date("July 27, 2024").toISOString(),
  },
];

export function useNotifications() {
  // fake notifications query
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return notifications;
    },
  });
}
