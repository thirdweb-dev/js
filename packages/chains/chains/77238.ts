import type { Chain } from "../src/types";
export default {
  "chainId": 77238,
  "chain": "tFNC",
  "name": "Foundry Chain Testnet",
  "rpc": [
    "https://foundry-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.foundryscan.org/"
  ],
  "slug": "foundry-chain-testnet",
  "icon": {
    "url": "ipfs://bafkreifx4vef7ubqz4iiaxckcvkdwjrp2hbliljwjlwu2vytlngg3r4pg4",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "faucets": [
    "https://faucet.foundryscan.org"
  ],
  "nativeCurrency": {
    "name": "Foundry Chain Testnet",
    "symbol": "tFNC",
    "decimals": 18
  },
  "infoURL": "https://foundrychain.org",
  "shortName": "fnc",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Foundry Scan Testnet",
      "url": "https://testnet-explorer.foundryscan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;