import type { Chain } from "../src/types";
export default {
  "name": "Siberium Test Network",
  "chain": "SBR",
  "rpc": [
    "https://siberium-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.siberium.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TestSIBR",
    "symbol": "SIBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "shortName": "testsbr",
  "chainId": 111000,
  "networkId": 111000,
  "icon": {
    "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Siberium Testnet Explorer - blockscout",
      "url": "https://explorer.test.siberium.net",
      "icon": {
        "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
        "width": 512,
        "height": 512,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "siberium-test-network"
} as const satisfies Chain;