import type { Chain } from "../src/types";
export default {
  "chainId": 47279324479,
  "chain": "Xai Goerli Orbit Testnet",
  "name": "Xai Goerli Orbit",
  "rpc": [
    "https://xai-goerli-orbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.xai-chain.net/rpc"
  ],
  "slug": "xai-goerli-orbit",
  "faucets": [],
  "nativeCurrency": {
    "name": "Xai Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://xai.games/",
  "shortName": "xai-goerli",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Xai Goerli Testnet Explorer",
      "url": "https://testnet-explorer.xai-chain.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;