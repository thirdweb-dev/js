import type { Chain } from "../src/types";
export default {
  "name": "Foundry Chain Testnet",
  "chain": "tFNC",
  "icon": {
    "url": "ipfs://bafkreifx4vef7ubqz4iiaxckcvkdwjrp2hbliljwjlwu2vytlngg3r4pg4",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "rpc": [
    "https://foundry-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.foundryscan.org/"
  ],
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
  "chainId": 77238,
  "networkId": 77238,
  "explorers": [
    {
      "name": "Foundry Scan Testnet",
      "url": "https://testnet-explorer.foundryscan.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "foundry-chain-testnet"
} as const satisfies Chain;