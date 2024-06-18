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
    "https://876.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.oasvrs.bnken.net"
  ],
  "shortName": "BNKEN",
  "slug": "bandai-namco-research-verse",
  "testnet": false
} as const satisfies Chain;