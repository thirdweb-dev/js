import type { Chain } from "../src/types";
export default {
  "chain": "NetMind",
  "chainId": 1100789,
  "explorers": [
    {
      "name": "NetMind Testnet Explorer",
      "url": "https://testbrower.protago-dev.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://netmind.ai",
  "name": "Netmind Chain Testnet",
  "nativeCurrency": {
    "name": "NMT",
    "symbol": "NMT",
    "decimals": 18
  },
  "networkId": 1100789,
  "rpc": [
    "https://1100789.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testblock.protago-dev.com"
  ],
  "shortName": "nmtTest",
  "slug": "netmind-chain-testnet",
  "testnet": true,
  "title": "NetMind Chain Testnet"
} as const satisfies Chain;