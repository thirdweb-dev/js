import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 220,
  "explorers": [
    {
      "name": "scalind",
      "url": "https://explorer-sepolia.scalind.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.scalind.com"
  ],
  "icon": {
    "url": "ipfs://QmayuauUTSkYxbT1xi2AkkG5VLEMDhcMeZ18WZHiApPa9M",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://scalind.com",
  "name": "Scalind Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 220,
  "rpc": [
    "https://scalind-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://220.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-sepolia.scalind.com"
  ],
  "shortName": "sepscal",
  "slug": "scalind-testnet",
  "testnet": true
} as const satisfies Chain;