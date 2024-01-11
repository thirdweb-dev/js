import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1911,
  "explorers": [
    {
      "name": "scalind",
      "url": "https://explorer.scalind.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmayuauUTSkYxbT1xi2AkkG5VLEMDhcMeZ18WZHiApPa9M",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://scalind.com",
  "name": "Scalind",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1911,
  "rpc": [
    "https://scalind.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1911.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scalind.com"
  ],
  "shortName": "scal",
  "slug": "scalind",
  "testnet": false
} as const satisfies Chain;