import type { Chain } from "../src/types";
export default {
  "chain": "SBR",
  "chainId": 111000,
  "explorers": [
    {
      "name": "Siberium Testnet Explorer - blockscout",
      "url": "https://explorer.test.siberium.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://siberium.net",
  "name": "Siberium Test Network",
  "nativeCurrency": {
    "name": "TestSIBR",
    "symbol": "SIBR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://siberium-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.siberium.net"
  ],
  "shortName": "testsbr",
  "slug": "siberium-test-network",
  "testnet": true
} as const satisfies Chain;