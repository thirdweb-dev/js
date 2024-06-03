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