import type { Chain } from "../src/types";
export default {
  "name": "Xai Goerli Orbit",
  "chain": "Xai Goerli Orbit Testnet",
  "shortName": "xai-goerli",
  "chainId": 47279324479,
  "testnet": true,
  "nativeCurrency": {
    "name": "Xai Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpc": [
    "https://xai-goerli-orbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.xai-chain.net/rpc"
  ],
  "explorers": [
    {
      "name": "Xai Goerli Testnet Explorer",
      "url": "https://testnet-explorer.xai-chain.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://xai.games/",
  "slug": "xai-goerli-orbit"
} as const satisfies Chain;