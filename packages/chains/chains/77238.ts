import type { Chain } from "../src/types";
export default {
  "chain": "tFNC",
  "chainId": 77238,
  "explorers": [
    {
      "name": "Foundry Scan Testnet",
      "url": "https://testnet-explorer.foundryscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.foundryscan.org"
  ],
  "icon": {
    "url": "ipfs://bafkreifx4vef7ubqz4iiaxckcvkdwjrp2hbliljwjlwu2vytlngg3r4pg4",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://foundrychain.org",
  "name": "Foundry Chain Testnet",
  "nativeCurrency": {
    "name": "Foundry Chain Testnet",
    "symbol": "tFNC",
    "decimals": 18
  },
  "networkId": 77238,
  "rpc": [
    "https://77238.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.foundryscan.org/"
  ],
  "shortName": "fnc",
  "slip44": 1,
  "slug": "foundry-chain-testnet",
  "testnet": true
} as const satisfies Chain;