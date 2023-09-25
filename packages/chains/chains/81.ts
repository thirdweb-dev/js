import type { Chain } from "../src/types";
export default {
  "chainId": 81,
  "chain": "JOC",
  "name": "Japan Open Chain Mainnet",
  "rpc": [
    "https://japan-open-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.japanopenchain.org:8545",
    "https://rpc-2.japanopenchain.org:8545"
  ],
  "slug": "japan-open-chain",
  "icon": {
    "url": "ipfs://bafkreidhsiuqrct42bel76zhi3rx35k4lnk6aqgde27nvvxcz563ttfefy",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Japan Open Chain Token",
    "symbol": "JOC",
    "decimals": 18
  },
  "infoURL": "https://www.japanopenchain.org/",
  "shortName": "joc",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "Block Explorer",
      "url": "https://explorer.japanopenchain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;