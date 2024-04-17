import type { Chain } from "../src/types";
export default {
  "chain": "Photon",
  "chainId": 54555,
  "explorers": [
    {
      "name": "photon_testnet_explorer",
      "url": "https://testnet.photonchain.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://photonchain.io/airdrop"
  ],
  "infoURL": "https://photonchain.io",
  "name": "Photon Testnet",
  "nativeCurrency": {
    "name": "Photon",
    "symbol": "PTON",
    "decimals": 18
  },
  "networkId": 54555,
  "rpc": [
    "https://54555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.photonchain.io"
  ],
  "shortName": "pton",
  "slug": "photon-testnet",
  "testnet": true
} as const satisfies Chain;