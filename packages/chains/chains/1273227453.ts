import type { Chain } from "../src/types";
export default {
  "name": "HUMAN Protocol",
  "title": "HUMAN Protocol",
  "chain": "wan-red-ain",
  "rpc": [
    "https://human-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/wan-red-ain"
  ],
  "faucets": [
    "https://dashboard.humanprotocol.org/faucet"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.humanprotocol.org",
  "shortName": "human-mainnet",
  "chainId": 1273227453,
  "networkId": 1273227453,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://wan-red-ain.explorer.mainnet.skalenodes.com",
      "icon": {
        "url": "ipfs://QmT5KKrpNt6duU8QfwaYw3xf4ifTBPtjahpWsMi3gsFmcS",
        "width": 440,
        "height": 600,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "human-protocol"
} as const satisfies Chain;