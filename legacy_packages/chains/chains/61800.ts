import type { Chain } from "../src/types";
export default {
  "chain": "AXEL",
  "chainId": 61800,
  "explorers": [
    {
      "name": "AxelChain Dev-Net Explorer",
      "url": "https://devexplorer2.viacube.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.axel.org",
  "name": "AxelChain Dev-Net",
  "nativeCurrency": {
    "name": "Axelium",
    "symbol": "AIUM",
    "decimals": 18
  },
  "networkId": 61800,
  "rpc": [
    "https://61800.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aium-rpc-dev.viacube.com"
  ],
  "shortName": "aium-dev",
  "slug": "axelchain-dev-net",
  "testnet": false
} as const satisfies Chain;