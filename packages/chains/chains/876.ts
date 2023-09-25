import type { Chain } from "../src/types";
export default {
  "chainId": 876,
  "chain": "Bandai Namco Research Verse",
  "name": "Bandai Namco Research Verse Mainnet",
  "rpc": [
    "https://bandai-namco-research-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.oasvrs.bnken.net"
  ],
  "slug": "bandai-namco-research-verse",
  "icon": {
    "url": "ipfs://bafkreifhetalm3vpvjrg5u5d2momkcgvkz6rhltur5co3rslltbxzpr6yq",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.bandainamco-mirai.com/en/",
  "shortName": "BNKEN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bandai Namco Research Verse Explorer",
      "url": "https://explorer.main.oasvrs.bnken.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;