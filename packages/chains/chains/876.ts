import type { Chain } from "../src/types";
export default {
  "chain": "Bandai Namco Research Verse",
  "chainId": 876,
  "explorers": [
    {
      "name": "Bandai Namco Research Verse Explorer",
      "url": "https://explorer.main.oasvrs.bnken.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreifhetalm3vpvjrg5u5d2momkcgvkz6rhltur5co3rslltbxzpr6yq",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://www.bandainamco-mirai.com/en/",
  "name": "Bandai Namco Research Verse Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 876,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://bandai-namco-research-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://876.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.oasvrs.bnken.net"
  ],
  "shortName": "BNKEN",
  "slug": "bandai-namco-research-verse",
  "testnet": false
} as const satisfies Chain;