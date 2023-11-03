import type { Chain } from "../types";
export default {
  "chain": "Xai Goerli Orbit Testnet",
  "chainId": 47279324479,
  "explorers": [
    {
      "name": "Xai Goerli Testnet Explorer",
      "url": "https://testnet-explorer.xai-chain.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://xai.games/",
  "name": "Xai Goerli Orbit",
  "nativeCurrency": {
    "name": "Xai Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 47279324479,
  "redFlags": [],
  "rpc": [
    "https://xai-goerli-orbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://47279324479.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.xai-chain.net/rpc"
  ],
  "shortName": "xai-goerli",
  "slug": "xai-goerli-orbit",
  "testnet": true
} as const satisfies Chain;