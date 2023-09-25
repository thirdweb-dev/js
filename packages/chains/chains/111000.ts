import type { Chain } from "../src/types";
export default {
  "chainId": 111000,
  "chain": "SBR",
  "name": "Siberium Test Network",
  "rpc": [
    "https://siberium-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.siberium.net"
  ],
  "slug": "siberium-test-network",
  "icon": {
    "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TestSIBR",
    "symbol": "SIBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "shortName": "testsbr",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Siberium Testnet Explorer - blockscout",
      "url": "https://explorer.test.siberium.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;